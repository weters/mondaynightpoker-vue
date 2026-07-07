import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import GameSelector from './GameSelector.vue'
import games from '@/games'
import { useRootStore } from '@/store'

describe('GameSelector', () => {
    let pinia, root

    beforeEach(() => {
        pinia = createPinia()
        setActivePinia(pinia)
        root = useRootStore()
        // a site admin can always start a game
        root.user = {player: {id: 1, isSiteAdmin: true}}
        vi.spyOn(root, 'webSocketSend').mockResolvedValue({})
    })

    const mountSelector = () => mount(GameSelector, {
        shallow: true,
        global: {plugins: [pinia]},
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

        expect(root.webSocketSend).toHaveBeenCalledTimes(1)
        const payload = root.webSocketSend.mock.calls[0][0]
        expect(payload).toEqual({action: 'createGame', subject: 'guts', additionalData: {ante: 25}})
    })

    it('shows a waiting message when the player cannot start a game', () => {
        // no admin flags and no clientState, so canStart computes false
        root.user = {player: {id: 1, isSiteAdmin: false}}

        const wrapper = mountSelector()
        expect(wrapper.text()).toContain('Waiting on the table admin')
        expect(wrapper.findComponent(games[0].selector).exists()).toBe(false)
    })
})
