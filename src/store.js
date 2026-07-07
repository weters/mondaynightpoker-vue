import { defineStore } from 'pinia'
import {formatAmount} from "./currency"
import * as webSocket from "./webSocket"

let errorTimeout, notificationTimeout, logIdCounter = 0

export const useRootStore = defineStore('root', {
    state: () => ({
        user: null, // { player: Object, jwt: String }
        game: null,
        clientState: null,
        logs: [],
        error: null,
        notification: null,
        scheduledGame: null,
    }),
    getters: {
        isSiteAdmin: state => Boolean(state.user && state.user.player && state.user.player.isSiteAdmin),
        playerDataById: state => id => state.clientState && state.clientState[id],
        userClientState(state) {
            return state.user && state.user.player && this.playerDataById(state.user.player.id)
        },
        // userClientState is null until the server sends the first clientState message,
        // so the permission getters must not assume it exists
        isTableAdmin() {
            return Boolean(this.isSiteAdmin || this.userClientState?.isTableAdmin)
        },
        canStart() {
            return Boolean(this.isTableAdmin || this.userClientState?.canStart)
        },
        canRestart() {
            return Boolean(this.isTableAdmin || this.userClientState?.canRestart)
        },
        canTerminate() {
            return Boolean(this.isTableAdmin || this.userClientState?.canTerminate)
        },
        gameRules: state => state.game?.rules || [],
    },
    actions: {
        addLogs(logs) {
            if (!logs) {
                return
            }

            const existingUuids = new Set(this.logs.map(l => l.uuid))
            const formattedLogs = logs
                .filter(log => !log.uuid || !existingUuids.has(log.uuid))
                .map(log => {
                    let players = ''
                    if (log.playerIds && log.playerIds.length > 0 && log.playerIds[0] !== 0) {
                        // clientState may not have arrived yet when the first logs come in
                        players = log.playerIds.map(pid => this.clientState?.[pid]?.player.displayName ?? '').join(', ')
                    }

                    const cards = log.cards ? log.cards : []

                    let message = log.message.replace(/{}/g, players)
                    message = message.replace(/\${(-?\d+)}/g, (match, cents) => formatAmount(cents))
                    return {
                        ...log,
                        key: log.uuid || `log-${++logIdCounter}`,
                        message,
                        cards,
                    }
                })

            this.logs.push(...formattedLogs)
            const len = this.logs.length
            const over = len - 100
            if (over > 0) {
                this.logs.splice(0, over)
            }
        },
        clearLogs() {
            this.logs = []
        },
        setUser(user) {
            this.user = user
        },
        setUserPlayer(player) {
            if (!this.user) {
                throw new Error('no user')
            }

            this.user.player = player
            this.user = Object.assign({}, this.user)
        },
        clearUser() {
            this.user = null
        },
        setGame(message) {
            this.game = message
        },
        clearGame() {
            this.game = null
        },
        setClientState(clientState) {
            this.clientState = clientState
        },
        // webSocketSend sends a player action over the table's WebSocket connection.
        // Returns a promise that resolves with the server's reply, so callers can
        // chain .catch/.finally as with any async action.
        webSocketSend({action, subject = null, cards = null, additionalData = null}) {
            return webSocket.send(action, subject, cards, additionalData)
        },
        setError(error) {
            this.error = error

            if (errorTimeout) {
                clearTimeout(errorTimeout)
                errorTimeout = null
            }

            if (error !== null) {
                errorTimeout = setTimeout(() => {
                    this.error = null
                }, 2500)
            }
        },
        setNotification(notification) {
            this.notification = notification

            if (notificationTimeout) {
                clearTimeout(notificationTimeout)
                notificationTimeout = null
            }

            if (notification !== null) {
                notificationTimeout = setTimeout(() => {
                    this.notification = null
                }, 2500)
            }
        },
        setScheduledGame(scheduledGame) {
            this.scheduledGame = scheduledGame

            if (scheduledGame) {
                setTimeout(() => {
                    if (!this.scheduledGame || this.scheduledGame.start === scheduledGame.start) {
                        this.scheduledGame = null
                    }
                }, new Date(scheduledGame.start) - new Date())
            }
        },
    },
})
