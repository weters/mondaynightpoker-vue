export default {
    namespaced: true,
    getters: {
        gameState: (state, getters, rootState) => rootState.game.data.gameState,
        config: (state, getters) => getters.gameState.config,
        actions: (state, getters, rootState) => rootState.game.data.actions,
    }
}