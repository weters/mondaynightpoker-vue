export default {
    namespaced: true,
    getters: {
        gameState: (state, getters, rootState) => rootState.game.data.gameState,
        actions: (state, getters, rootState) => rootState.game.data.actions,
        futureActions: (state, getters, rootState) => rootState.game.data.futureActions,
        activeParticipant: (state, getters, rootState) => rootState.game.data.participant,
    }
}