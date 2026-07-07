import { defineStore } from 'pinia'
import { useRootStore } from '@/store'

export const usePassThePoopStore = defineStore('passThePoop', {
    getters: {
        // guard the entry getters: the game may clear while components are unmounting
        gameData: () => useRootStore().game?.data ?? {},
        gameState() {
            return this.gameData.gameState ?? {}
        },
        card() {
            return this.gameData.card
        },
        availableActions() {
            return this.gameData.availableActions
        },
        isCurrentTurn() {
            return this.gameState.currentTurn === useRootStore().user.player.id
        },
        isPlayerTurn() {
            return id => this.gameState.currentTurn === id
        },
    },
})
