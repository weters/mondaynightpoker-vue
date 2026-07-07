import { describe, it, expect } from 'vitest'
import games, { componentForSlug } from './index'

// This list is the frontend's contract with the backend's game factory registry
// (pkg/room/gamefactory/gamefactory.go). If a game is added or renamed, update both
// registries; the backend's gamefactory test pins the same slugs on its side.
const expectedSlugs = [
    'acey-deucey',
    'bourre',
    'guts',
    'texas-hold-em',
    'seven-card',
    'little-l',
    'pass-the-poop',
]

describe('game registry', () => {
    it('contains exactly the games the backend serves, in display order', () => {
        expect(games.map(g => g.slug)).toEqual(expectedSlugs)
    })

    it('has unique slugs', () => {
        const slugs = games.map(g => g.slug)
        expect(new Set(slugs).size).toBe(slugs.length)
    })

    it('has a label, component, selector, and store for every game', () => {
        for (const game of games) {
            expect(game.label, game.slug).toBeTruthy()
            expect(game.component, game.slug).toBeTruthy()
            expect(game.selector, game.slug).toBeTruthy()
            expect(typeof game.store, game.slug).toBe('function')
        }
    })
})

describe('componentForSlug', () => {
    it('returns the component for a known slug', () => {
        expect(componentForSlug('guts')).toBe(games.find(g => g.slug === 'guts').component)
    })

    it('returns null for an unknown slug', () => {
        expect(componentForSlug('not-a-game')).toBeNull()
        expect(componentForSlug(undefined)).toBeNull()
    })
})

describe('game stores', () => {
    it('shares the poker store between seven-card and little-l', () => {
        const bySlug = slug => games.find(g => g.slug === slug)
        expect(bySlug('seven-card').store).toBe(bySlug('little-l').store)

        // every other game has its own store function
        const others = games.filter(g => g.slug !== 'seven-card' && g.slug !== 'little-l')
        const stores = new Set(others.map(g => g.store))
        expect(stores.size).toBe(others.length)
    })
})
