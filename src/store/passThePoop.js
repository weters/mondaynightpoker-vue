export default {
    namespaced: true,
    getters: {
        gameData: (state, getters, rootState) => rootState.game.data,
        card: (state, getters) => getters.gameData.card,
        isCurrentTurn: (state, getters, rootState) => {
            return getters.gameData.gameState.currentTurn === rootState.user.player.id
        },
        isPlayerTurn: (state, getters) => id => getters.gameData.gameState.currentTurn === id,
    }
}