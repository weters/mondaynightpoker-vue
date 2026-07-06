export default {
    namespaced: true,
    getters: {
        // guard the root read: the game may clear while components are unmounting
        gameState: (state, getters, rootState) => rootState.game?.data?.gameState ?? {},
        actions: (state, getters, rootState) => rootState.game?.data?.actions,
        futureActions: (state, getters, rootState) => rootState.game?.data?.futureActions,
        activeParticipant: (state, getters, rootState) => rootState.game?.data?.participant,
    }
}