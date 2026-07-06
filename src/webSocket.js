import { v4 as uuid } from 'uuid'
import bus from "./bus"
import {formatAmount} from "@/currency"

const baseURL = import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:5080'

const requestTimeout = 2000
const initialRetryDelay = 1000
const maxRetryDelay = 30000

export class WebSocketClient {
    constructor(tableUUID, store) {
        this.tableUUID = tableUUID
        this.store = store
        this.ws = null
        this.closed = false
        this.retryDelay = initialRetryDelay

        // this is used to track requests back from the server with its original request
        this.context = {}

        this._connect()
    }

    send(action, subject, cards, additionalData) {
        const context = uuid()
        this.ws.send(JSON.stringify({
            action,
            subject,
            cards,
            additionalData,
            context,
        }))

        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('did not receive response from server'))
                delete(this.context[context])
            }, requestTimeout)

            this.context[context] = {
                resolve,
                reject,
                timeout,
            }
        })
    }

    close() {
        this.closed = true
        if (this.ws) {
            this.ws.close(1000)
        }
    }

    _connect() {
        const user = this.store.state.user
        if (!user || !user.jwt) {
            throw new Error('logged in user not found')
        }

        const url = `${baseURL}/table/${encodeURIComponent(this.tableUUID)}/ws?access_token=${encodeURIComponent(user.jwt)}`
        const ws = new WebSocket(url)
        ws.onopen = this._open.bind(this)
        ws.onclose = this._close.bind(this)
        ws.onmessage = this._message.bind(this)
        ws.onerror = this._error.bind(this)

        this.ws = ws
    }

    _open() {
        this.retryDelay = initialRetryDelay
    }

    // _close runs on any socket close. The server closes with an application code
    // (e.g., 4002 when the client cannot keep up), so reconnect on every close that
    // this client did not itself initiate, regardless of event.wasClean.
    _close() {
        this._rejectPendingRequests(new Error('connection closed'))
        this.store.commit('clearGame')

        if (this.closed) {
            return
        }

        console.log(`lost connection to the server, reconnecting in ${this.retryDelay}ms`)
        setTimeout(() => {
            if (this.closed) {
                return
            }

            try {
                this._connect()
            } catch (err) {
                // the user is no longer logged in; give up
                console.error('could not reconnect', err)
            }
        }, this.retryDelay)

        this.retryDelay = Math.min(this.retryDelay * 2, maxRetryDelay)
    }

    _rejectPendingRequests(err) {
        for (const key of Object.keys(this.context)) {
            const { reject, timeout } = this.context[key]
            clearTimeout(timeout)
            reject(err)
            delete(this.context[key])
        }
    }

    _message({data}) {
        const message = JSON.parse(data)

        if (message.context && this.context[message.context]) {
            const { resolve, reject, timeout } = this.context[message.context]
            clearTimeout(timeout)
            delete(this.context[message.context])

            if (message.key === 'error') {
                let err = message.value
                if (typeof err === 'string') {
                    err = err.replace(/\$\{(-?\d+)\}/g, (match, cents) => formatAmount(cents))
                }

                reject(new Error(err))
                return
            }

            resolve(message)
            return
        }

        switch (message.key) {
            case 'clientState':
                this.store.commit('setClientState', message.data)
                break
            case 'game':
                this.store.commit('setGame', {
                    game: message.value,
                    data: message.data,
                    rules: message.rules || [],
                })
                break
            case 'gameEnded':
                this.store.commit('clearGame')
                break
            case 'logs':
                this.store.commit('addLogs', message.data)
                break
            case 'allLogs':
                this.store.commit('clearLogs')
                this.store.commit('addLogs', message.data)
                break
            case 'error':
                bus.emit('error', message.value)
                break
            case 'scheduledGame':
                this.store.dispatch('scheduledGame', message.data)
                break
            default:
                throw new Error(`could not process message: ${JSON.stringify(message)}`)
        }
    }

    _error(event) {
        console.log('error', event)
    }
}

// current is the singleton connection for the table the user is currently viewing
let current = null

// connect establishes the WebSocket connection for a table, replacing any previous connection
export function connect(tableUUID, store) {
    if (current) {
        current.close()
    }

    current = new WebSocketClient(tableUUID, store)
    return current
}

// disconnect closes the current connection, if any
export function disconnect() {
    if (current) {
        current.close()
        current = null
    }
}

// send sends a player action over the current connection and resolves with the server's reply
export function send(action, subject = null, cards = null, additionalData = null) {
    if (!current) {
        return Promise.reject(new Error('not connected to the table'))
    }

    try {
        return current.send(action, subject, cards, additionalData)
    } catch (err) {
        return Promise.reject(err)
    }
}
