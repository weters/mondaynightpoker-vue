export default {
    namespaced: true,
    getters: {
        // guard the entry getters: the game may clear while components are unmounting
        gameData: (state, getters, rootState) => rootState.game?.data ?? {},
        gameState: (state, getters) => getters.gameData.gameState ?? {},
        hand: (state, getters) => getters.gameData.hand,
        handRank: (state, getters) => getters.gameData.handRank,
        canDecide: (state, getters) => getters.gameData.canDecide,
        hasDecided: (state, getters) => getters.gameData.hasDecided,
        myDecision: (state, getters) => getters.gameData.myDecision,
        phase: (state, getters) => getters.gameState.phase,
        isDeclarationPhase: (state, getters) => getters.phase === 'declaration',
        isShowdown: (state, getters) => getters.phase === 'showdown' || getters.phase === 'roundEnd',
        isGameOver: (state, getters) => getters.gameState.isGameOver,
        participants: (state, getters) => getters.gameState.participants ?? [],
        decisions: (state, getters) => getters.gameState.decisions,
        showdownResult: (state, getters) => getters.gameState.showdownResult,
        pot: (state, getters) => getters.gameState.pot,
        overflowPot: (state, getters) => getters.gameState.overflowPot || 0,
        round: (state, getters) => getters.gameState.round,
        ante: (state, getters) => getters.gameState.ante,
        maxOwed: (state, getters) => getters.gameState.maxOwed,
        getParticipant: (state, getters) => (playerId) =>
            getters.participants.find(p => p.playerId === playerId),
        cardCount: (state, getters) => getters.gameState.cardCount,
        bloodyGuts: (state, getters) => getters.gameState.bloodyGuts,
        deckHand: (state, getters) => getters.gameState.deckHand,
        deckCardsRevealed: (state, getters) => getters.gameState.deckCardsRevealed,
        deckCardsTotal: (state, getters) => getters.gameState.deckCardsTotal,
        deckWon: (state, getters) => getters.showdownResult?.deckWon,
        isTradePhase: (state, getters) => getters.phase === 'tradeIn',
        canTrade: (state, getters) => getters.gameData.canTrade,
        currentTraderID: (state, getters) => getters.gameState.currentTraderId,
        allowTrades: (state, getters) => getters.gameState.allowTrades,
        getMyParticipant: (state, getters, rootState) => {
            const myId = rootState.user.player.id
            return getters.participants.find(p => p.playerId === myId)
        },
        myTraded: (state, getters) => getters.getMyParticipant?.traded || 0,
        hasTraded: (state, getters, rootState) => {
            const myId = rootState.user.player.id
            const tradesMade = getters.gameState.tradesMade
            return tradesMade && myId in tradesMade
        },
    },
}
