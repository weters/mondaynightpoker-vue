import Vuex from 'vuex'
import Vue from 'vue'
import bourre from './store/bourre'
import passThePoop from "./store/passThePoop"
import poker from "./store/poker"
import {formatAmount} from "./currency"

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        bourre,
        passThePoop,
        poker,
    },
    state: {
        user: null, // { player: Object, jwt: String }
        game: null,
        clientState: null,
        webSocket: null,
        logs: [],
        error: null,
        scheduledGame: null,
    },
    mutations: {
        addLogs(state, logs) {
            if (!logs) {
                return
            }

            const formattedLogs = logs.map(log => {
                let players = ''
                if (log.playerIds && log.playerIds.length > 0 && log.playerIds[0] !== 0) {
                    players = log.playerIds.map(pid => state.clientState[pid].player.displayName).join(', ')
                }

                const cards = log.cards ? log.cards : []

                let message = log.message.replace(/{}/g, players)
                message = message.replace(/\${(\d+)}/g, (match, cents) => formatAmount(cents))
                return {
                    ...log,
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
        setWebSocket(state, webSocket) {
            state.webSocket = webSocket
        },
        clearWebSocket(state) {
            state.webSocket = null
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
        scheduledGame(state, scheduledGame) {
            state.scheduledGame = scheduledGame
        },
    },
    actions: {
        error(context, error) {
            context.commit('error', error)

            if (error !== null) {
                setTimeout(() => context.commit('error', null), 2500)
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
        isSiteAdmin: state => state.user && state.user.player && state.user.player.isSiteAdmin,
        playerDataById: state => id => state.clientState && state.clientState[id],
        userClientState: (state, getters) => getters.playerDataById(state.user.player.id),
        isTableAdmin: (state, getters) => getters.isSiteAdmin || getters.userClientState.isTableAdmin,
        canStart: (state, getters) => getters.isTableAdmin || getters.userClientState.canStart,
        canRestart: (state, getters) => getters.isTableAdmin || getters.userClientState.canRestart,
        canTerminate: (state, getters) => getters.isTableAdmin || getters.userClientState.canTerminate,
    },
})

export default store