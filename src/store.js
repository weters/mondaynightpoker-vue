import Vuex from 'vuex'
import Vue from 'vue'
import bourre from './store/bourre'
import passThePoop from "./store/passThePoop"

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        bourre,
        passThePoop,
    },
    state: {
        user: null, // { player: Object, jwt: String }
        game: null,
        clientState: null,
        webSocket: null,
        logs: [],
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

                const message = log.message.replace(/{}/g, players)
                return {
                    ...log,
                    message,
                    cards,
                }
            })

            state.logs.push(...formattedLogs)
            const len = state.logs.length
            const over = len - 25
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
        }
    },
    getters: {
        isSiteAdmin: state => state.user && state.user.player && state.user.player.isSiteAdmin,
        playerDataById: state => id => state.clientState && state.clientState[id],
        userClientState: (state, getters) => getters.playerDataById(state.user.player.id),
        isTableAdmin: (state, getters) => getters.isSiteAdmin || getters.userClientState.isTableAdmin,
        canStart: (state, getters) => getters.isTableAdmin || getters.userClientState.canStart,
        canRestart: (state, getters) => getters.isTableAdmin || getters.userClientState.canRestart,
        canTerminate: (state, getters) => getters.isTableAdmin || getters.userClientState.canTerminate,
    }
})

export default store