import { defineStore } from 'pinia'
import { useRootStore } from '@/store'

export const useBourreStore = defineStore('bourre', {
    getters: {
        // guard the entry getters: the game may clear while components are unmounting
        gameData: () => useRootStore().game?.data ?? {},
        hand() {
            return this.gameData.hand
        },
        validMoves() {
            return this.gameData.validMoves ?? []
        },
        folded() {
            return this.gameData.folded
        },
        discards() {
            return this.gameData.discards
        },
        maxDraw() {
            return this.gameData.maxDraw
        },
        gameState() {
            return this.gameData.gameState ?? {}
        },
        seed() {
            return this.gameState.seed
        },

        round() {
            return this.gameState.round
        },
        canPlayCard() {
            return card => {
                for (let validCard of this.validMoves) {
                    if (card.rank === validCard.rank && card.suit === validCard.suit) {
                        return true
                    }
                }

                return false
            }
        },
        isTurn() {
            return useRootStore().user.player.id === this.gameState.currentTurn
        },
        isTradeInRound() {
            return this.gameState.round === 0
        },
        isRoundOver() {
            return this.gameState.isRoundOver
        },
        isGameOver() {
            return this.gameState.isGameOver
        },

        getCurrentPlayer() {
            return (playerId) => (this.gameState.players ?? []).find(p => p.playerId === playerId)
        },
    },
})
