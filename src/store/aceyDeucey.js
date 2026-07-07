import { defineStore } from 'pinia'
import { useRootStore } from '@/store'

export const useAceyDeuceyStore = defineStore('aceyDeucey', {
    getters: {
        // guard the root read: the game may clear while components are unmounting
        gameState: () => useRootStore().game?.data?.gameState ?? {},
        config() {
            return this.gameState.config
        },
        actions: () => useRootStore().game?.data?.actions,
    },
})
