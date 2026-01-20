import store from './store'
import { v4 as uuid } from 'uuid'
import bus from "./bus"
import {formatAmount} from "@/currency"

const baseURL = import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:5080'

class webSocketClient {
    constructor(tableUUID) {
        this.tableUUID = tableUUID
        this.ws = null
        this._connect()

        // this is used to track requests back from the server with its original request
        this.context = {}
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
                reject('did not receive response from server')
                delete(this.context[context])
            }, 2000)

            this.context[context] = {
                resolve,
                reject,
                timeout,
            }
        })
    }

    close() {
        this.ws.close(1000)
    }

    _connect() {
        const user = store.state.user
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

    _open(event) {
        console.log('open', event)
    }

    _close(event) {
        store.commit('clearGame')
        if (!event.wasClean) {
            console.log('lost connection to the server, attempting to reconnect')
            setTimeout(() => {
                this._connect()
            }, 2500)
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
                store.commit('setClientState', message.data)
                break
            case 'game':
                store.commit('setGame', {
                    game: message.value,
                    data: message.data,
                })
                break
            case 'gameEnded':
                store.commit('clearGame')
                break
            case 'logs':
                store.commit('addLogs', message.data)
                break
            case 'allLogs':
                store.commit('clearLogs')
                store.commit('addLogs', message.data)
                break
            case 'error':
                bus.emit('error', message.value)
                break
            case 'scheduledGame':
                store.dispatch('scheduledGame', message.data)

                break
            default:
                throw new Error(`could not process message: ${JSON.stringify(message)}`)
        }
    }

    _error(event) {
        console.log('error', event)
    }
}

export default webSocketClient
