import { defineStore } from 'pinia'
import { useRootStore } from '@/store'

export const usePokerStore = defineStore('poker', {
    getters: {
        // guard the root read: the game may clear while components are unmounting
        gameState: () => useRootStore().game?.data?.gameState ?? {},
        pokerState: () => useRootStore().game?.data?.pokerState,
        self: () => useRootStore().game?.data?.participant,
        actions: () => useRootStore().game?.data?.actions,
        futureActions: () => useRootStore().game?.data?.futureActions,
    },
})
