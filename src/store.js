import Vuex from 'vuex'
import Vue from 'vue'
import bourre from './store/bourre'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        bourre,
    },
    state: {
        user: null, // { player: Object, jwt: String }
        game: null,
        clientState: null,
        webSocket: null,
    },
    mutations: {
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
    }
})

export default store