import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import GameSelector from './GameSelector.vue'
import games from '@/games'

describe('GameSelector', () => {
    let webSocketSend, store

    beforeEach(() => {
        webSocketSend = vi.fn().mockResolvedValue({})
        store = createStore({
            getters: {
                canStart: () => true,
            },
            actions: {
                webSocketSend,
            },
        })
    })

    const mountSelector = () => mount(GameSelector, {
        shallow: true,
        global: {plugins: [store]},
    })

    it('renders one selector per registered game', () => {
        const wrapper = mountSelector()

        for (const game of games) {
            expect(wrapper.findComponent(game.selector).exists(), game.slug).toBe(true)
        }
    })

    it('starts a game with the registry slug, ignoring the payload game field', () => {
        const wrapper = mountSelector()
        const guts = games.find(g => g.slug === 'guts')

        wrapper.findComponent(guts.selector).vm.$emit('submit', {game: 'stale-slug', opts: {ante: 25}})

        expect(webSocketSend).toHaveBeenCalledTimes(1)
        const payload = webSocketSend.mock.calls[0][1]
        expect(payload).toEqual({action: 'createGame', subject: 'guts', additionalData: {ante: 25}})
    })

    it('shows a waiting message when the player cannot start a game', () => {
        store = createStore({
            getters: {canStart: () => false},
            actions: {webSocketSend},
        })

        const wrapper = mountSelector()
        expect(wrapper.text()).toContain('Waiting on the table admin')
        expect(wrapper.findComponent(games[0].selector).exists()).toBe(false)
    })
})
