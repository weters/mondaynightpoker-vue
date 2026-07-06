import { describe, it, expect } from 'vitest'
import { createStore } from 'vuex'
import guts from './guts'

function makeStore(game) {
    return createStore({
        state: {
            game: game ?? null,
            user: {player: {id: 1}},
        },
        modules: {guts},
    })
}

describe('guts module with no active game', () => {
    it('returns safe defaults instead of throwing', () => {
        const store = makeStore(null)

        expect(store.getters['guts/gameData']).toEqual({})
        expect(store.getters['guts/gameState']).toEqual({})
        expect(store.getters['guts/phase']).toBeUndefined()
        expect(store.getters['guts/participants']).toEqual([])
        expect(store.getters['guts/getParticipant'](1)).toBeUndefined()
        expect(store.getters['guts/getMyParticipant']).toBeUndefined()
        expect(store.getters['guts/isDeclarationPhase']).toBe(false)
    })
})

describe('guts module with an active game', () => {
    it('projects the game state', () => {
        const store = makeStore({
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

        expect(store.getters['guts/phase']).toBe('declaration')
        expect(store.getters['guts/isDeclarationPhase']).toBe(true)
        expect(store.getters['guts/pot']).toBe(500)
        expect(store.getters['guts/canDecide']).toBe(true)
        expect(store.getters['guts/getParticipant'](2)).toEqual({playerId: 2, traded: 0})
        expect(store.getters['guts/getMyParticipant']).toEqual({playerId: 1, traded: 1})
        expect(store.getters['guts/myTraded']).toBe(1)
    })
})
