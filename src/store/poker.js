export default {
    namespaced: true,
    state: {
    },
    mutations: {
    },
    getters: {
        gameState: (state, getters, rootState) => rootState.game.data.gameState,
        pokerState: (state, getters, rootState) => rootState.game.data.pokerState,
        self: (state, getters, rootState) => rootState.game.data.participant,
        actions: (state, getters, rootState) => rootState.game.data.actions,
        futureActions: (state, getters, rootState) => rootState.game.data.futureActions,
    }
}