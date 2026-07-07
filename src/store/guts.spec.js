import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useRootStore } from '@/store'
import { useGutsStore } from './guts'

beforeEach(() => {
    setActivePinia(createPinia())
})

function makeStore(game) {
    const root = useRootStore()
    root.game = game ?? null
    root.user = {player: {id: 1}}
    return useGutsStore()
}

describe('guts store with no active game', () => {
    it('returns safe defaults instead of throwing', () => {
        const guts = makeStore(null)

        expect(guts.gameData).toEqual({})
        expect(guts.gameState).toEqual({})
        expect(guts.phase).toBeUndefined()
        expect(guts.participants).toEqual([])
        expect(guts.getParticipant(1)).toBeUndefined()
        expect(guts.getMyParticipant).toBeUndefined()
        expect(guts.isDeclarationPhase).toBe(false)
    })
})

describe('guts store with an active game', () => {
    it('projects the game state', () => {
        const guts = makeStore({
            game: 'guts',
            data: {
                hand: ['2s', '3h'],
                canDecide: true,
                gameState: {
                    phase: 'declaration',
                    pot: 500,
                    participants: [
                        {playerId: 1, traded: 1},
                        {playerId: 2, traded: 0},
                    ],
                },
            },
        })

        expect(guts.phase).toBe('declaration')
        expect(guts.isDeclarationPhase).toBe(true)
        expect(guts.pot).toBe(500)
        expect(guts.canDecide).toBe(true)
        expect(guts.getParticipant(2)).toEqual({playerId: 2, traded: 0})
        expect(guts.getMyParticipant).toEqual({playerId: 1, traded: 1})
        expect(guts.myTraded).toBe(1)
    })
})
