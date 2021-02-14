export default {
    namespaced: true,
    getters: {
        gameState: (state, getters, rootState) => rootState.game.data.gameState,
        actions: (state, getters, rootState) => rootState.game.data.actions,
        activeParticipant: (state, getters, rootState) => rootState.game.data.participant,
    }
}