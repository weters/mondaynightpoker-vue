export default {
    namespaced: true,
    getters: {
        gameData: (state, getters, rootState) => rootState.game.data,
        hand: (state, getters) => getters.gameData.hand,
        folded: (state, getters) => getters.gameData.folded,
        discards: (state, getters) => getters.gameData.discards,
        maxDraw: (state, getters) => getters.gameData.maxDraw,
        gameState: (state, getters) => getters.gameData.gameState,
        seed: (state, getters) => getters.gameState.seed,

        round: (state, getters) => getters.gameState.round,
        isTurn: (state, getters, rootState) => rootState.user.player.id === getters.gameState.currentTurn,
        isTradeInRound: (state, getters) => getters.gameState.round === 0,
        isRoundOver: (state, getters) => getters.gameState.isRoundOver,
        isGameOver: (state, getters) => getters.gameState.isGameOver,
    },
}