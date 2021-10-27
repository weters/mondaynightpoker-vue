export default {
    namespaced: true,
    getters: {
        gameData: (state, getters, rootState) => rootState.game.data,
        hand: (state, getters) => getters.gameData.hand,
        validMoves: (state, getters) => getters.gameData.validMoves,
        folded: (state, getters) => getters.gameData.folded,
        discards: (state, getters) => getters.gameData.discards,
        maxDraw: (state, getters) => getters.gameData.maxDraw,
        gameState: (state, getters) => getters.gameData.gameState,
        seed: (state, getters) => getters.gameState.seed,

        round: (state, getters) => getters.gameState.round,
        canPlayCard: (state, getters) => card => {
            for (let validCard of getters.validMoves) {
                if (card.rank === validCard.rank && card.suit === validCard.suit) {
                    return true
                }
            }

            return false
        },
        isTurn: (state, getters, rootState) => rootState.user.player.id === getters.gameState.currentTurn,
        isTradeInRound: (state, getters) => getters.gameState.round === 0,
        isRoundOver: (state, getters) => getters.gameState.isRoundOver,
        isGameOver: (state, getters) => getters.gameState.isGameOver,

        getCurrentPlayer: (state, getters) => (playerId) => getters.gameState.players.find(p => p.playerId === playerId),
    },
}