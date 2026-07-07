import { defineStore } from 'pinia'
import { useRootStore } from '@/store'

export const useGutsStore = defineStore('guts', {
    getters: {
        // guard the entry getters: the game may clear while components are unmounting
        gameData: () => useRootStore().game?.data ?? {},
        gameState() {
            return this.gameData.gameState ?? {}
        },
        hand() {
            return this.gameData.hand
        },
        handRank() {
            return this.gameData.handRank
        },
        canDecide() {
            return this.gameData.canDecide
        },
        hasDecided() {
            return this.gameData.hasDecided
        },
        myDecision() {
            return this.gameData.myDecision
        },
        phase() {
            return this.gameState.phase
        },
        isDeclarationPhase() {
            return this.phase === 'declaration'
        },
        isShowdown() {
            return this.phase === 'showdown' || this.phase === 'roundEnd'
        },
        isGameOver() {
            return this.gameState.isGameOver
        },
        participants() {
            return this.gameState.participants ?? []
        },
        decisions() {
            return this.gameState.decisions
        },
        showdownResult() {
            return this.gameState.showdownResult
        },
        pot() {
            return this.gameState.pot
        },
        overflowPot() {
            return this.gameState.overflowPot || 0
        },
        round() {
            return this.gameState.round
        },
        ante() {
            return this.gameState.ante
        },
        maxOwed() {
            return this.gameState.maxOwed
        },
        getParticipant() {
            return (playerId) => this.participants.find(p => p.playerId === playerId)
        },
        cardCount() {
            return this.gameState.cardCount
        },
        bloodyGuts() {
            return this.gameState.bloodyGuts
        },
        deckHand() {
            return this.gameState.deckHand
        },
        deckCardsRevealed() {
            return this.gameState.deckCardsRevealed
        },
        deckCardsTotal() {
            return this.gameState.deckCardsTotal
        },
        deckWon() {
            return this.showdownResult?.deckWon
        },
        isTradePhase() {
            return this.phase === 'tradeIn'
        },
        canTrade() {
            return this.gameData.canTrade
        },
        currentTraderID() {
            return this.gameState.currentTraderId
        },
        allowTrades() {
            return this.gameState.allowTrades
        },
        getMyParticipant() {
            const myId = useRootStore().user.player.id
            return this.participants.find(p => p.playerId === myId)
        },
        myTraded() {
            return this.getMyParticipant?.traded || 0
        },
        hasTraded() {
            const myId = useRootStore().user.player.id
            const tradesMade = this.gameState.tradesMade
            return tradesMade && myId in tradesMade
        },
    },
})
