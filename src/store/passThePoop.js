export default {
    namespaced: true,
    getters: {
        // guard the entry getters: the game may clear while components are unmounting
        gameData: (state, getters, rootState) => rootState.game?.data ?? {},
        gameState: (state, getters) => getters.gameData.gameState ?? {},
        card: (state, getters) => getters.gameData.card,
        availableActions: (state, getters) => getters.gameData.availableActions,
        isCurrentTurn: (state, getters, rootState) => {
            return getters.gameState.currentTurn === rootState.user.player.id
        },
        isPlayerTurn: (state, getters) => id => getters.gameState.currentTurn === id,
    },
}