import { createStore } from 'vuex'
import {formatAmount} from "./currency"
import * as webSocket from "./webSocket"
import { storeModules } from "@/games"

let errorTimeout, notificationTimeout, logIdCounter = 0

const store = createStore({
    modules: storeModules(),
    state: {
        user: null, // { player: Object, jwt: String }
        game: null,
        clientState: null,
        logs: [],
        error: null,
        notification: null,
        scheduledGame: null,
    },
    mutations: {
        addLogs(state, logs) {
            if (!logs) {
                return
            }

            const existingUuids = new Set(state.logs.map(l => l.uuid))
            const formattedLogs = logs
                .filter(log => !log.uuid || !existingUuids.has(log.uuid))
                .map(log => {
                    let players = ''
                    if (log.playerIds && log.playerIds.length > 0 && log.playerIds[0] !== 0) {
                        // clientState may not have arrived yet when the first logs come in
                        players = log.playerIds.map(pid => state.clientState?.[pid]?.player.displayName ?? '').join(', ')
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

            state.logs.push(...formattedLogs)
            const len = state.logs.length
            const over = len - 100
            if (over > 0) {
                state.logs.splice(0, over)
            }
        },
        clearLogs(state) {
            state.logs = []
        },
        setUser(state, user) {
            state.user = user
        },
        setUserPlayer(state, player) {
            if (!state.user) {
                throw new Error('no user')
            }

            state.user.player = player
            state.user = Object.assign({}, state.user)
        },
        clearUser(state) {
            state.user = null
        },
        setGame(state, message) {
            state.game = message
        },
        clearGame(state) {
            state.game = null
        },
        setClientState(state, clientState) {
            state.clientState = clientState
        },
        error(state, error) {
            state.error = error
        },
        notification(state, notification) {
            state.notification = notification
        },
        scheduledGame(state, scheduledGame) {
            state.scheduledGame = scheduledGame
        },
    },
    actions: {
        // webSocketSend sends a player action over the table's WebSocket connection.
        // Returns a promise that resolves with the server's reply, so callers can
        // chain .catch/.finally as with any async action.
        webSocketSend(context, {action, subject = null, cards = null, additionalData = null}) {
            return webSocket.send(action, subject, cards, additionalData)
        },
        error(context, error) {
            context.commit('error', error)

            if (errorTimeout) {
                clearTimeout(errorTimeout)
                errorTimeout = null
            }

            if (error !== null) {
                errorTimeout = setTimeout(() => context.commit('error', null), 2500)
            }
        },
        notification(context, notification) {
            context.commit('notification', notification)

            if (notificationTimeout) {
                clearTimeout(notificationTimeout)
                notificationTimeout = null
            }

            if (notification !== null) {
                notificationTimeout = setTimeout(() => context.commit('notification', null), 2500)
            }
        },
        scheduledGame(context, scheduledGame) {
            context.commit('scheduledGame', scheduledGame)

            if (scheduledGame) {
                setTimeout(() => {
                    if (!context.state.scheduledGame || context.state.scheduledGame.start === scheduledGame.start) {
                        context.commit('scheduledGame', null)
                    }
                }, new Date(scheduledGame.start) - new Date())
            }
        },
    },
    getters: {
        isSiteAdmin: state => Boolean(state.user && state.user.player && state.user.player.isSiteAdmin),
        playerDataById: state => id => state.clientState && state.clientState[id],
        userClientState: (state, getters) => state.user && state.user.player && getters.playerDataById(state.user.player.id),
        // userClientState is null until the server sends the first clientState message,
        // so the permission getters must not assume it exists
        isTableAdmin: (state, getters) => Boolean(getters.isSiteAdmin || getters.userClientState?.isTableAdmin),
        canStart: (state, getters) => Boolean(getters.isTableAdmin || getters.userClientState?.canStart),
        canRestart: (state, getters) => Boolean(getters.isTableAdmin || getters.userClientState?.canRestart),
        canTerminate: (state, getters) => Boolean(getters.isTableAdmin || getters.userClientState?.canTerminate),
        gameRules: state => state.game?.rules || [],
    },
})

export default store
