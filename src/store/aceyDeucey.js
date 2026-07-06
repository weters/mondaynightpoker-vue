export default {
    namespaced: true,
    getters: {
        // guard the root read: the game may clear while components are unmounting
        gameState: (state, getters, rootState) => rootState.game?.data?.gameState ?? {},
        config: (state, getters) => getters.gameState.config,
        actions: (state, getters, rootState) => rootState.game?.data?.actions,
    }
}