import { defineStore } from 'pinia'
import { useRootStore } from '@/store'

export const useTexasHoldEmStore = defineStore('texasHoldEm', {
    getters: {
        // guard the root read: the game may clear while components are unmounting
        gameState: () => useRootStore().game?.data?.gameState ?? {},
        actions: () => useRootStore().game?.data?.actions,
        futureActions: () => useRootStore().game?.data?.futureActions,
        activeParticipant: () => useRootStore().game?.data?.participant,
    },
})
