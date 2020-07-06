export default {
    namespaced: true,
    state: {
    },
    mutations: {
    },
    getters: {
        gameState: (state, getters, rootState) => rootState.game.data.gameState,
        self: (state, getters, rootState) => rootState.game.data.participant,
        actions: (state, getters, rootState) => rootState.game.data.actions,
    }
}