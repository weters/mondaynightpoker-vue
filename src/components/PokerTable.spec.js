import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useRootStore } from '@/store'

// PokerTable.mounted() opens a websocket and fetches the table; stub both out.
vi.mock('@/webSocket', () => ({
    connect: vi.fn(),
    disconnect: vi.fn(),
    send: vi.fn(),
}))
vi.mock('@/client', () => ({
    default: {
        getTableByUUID: vi.fn(() => new Promise(() => {})), // never resolves
    },
}))
// Any slug maps to a stub game component so gameComponent is truthy.
vi.mock('@/games', () => ({
    default: [],
    componentForSlug: () => ({name: 'StubGame', render: () => null}),
}))

import PokerTable from './PokerTable.vue'
import Loading from './Loading.vue'

describe('PokerTable', () => {
    let pinia, root

    beforeEach(() => {
        pinia = createPinia()
        setActivePinia(pinia)
        root = useRootStore()
        root.user = {player: {id: 1}}
    })

    const mountTable = () => mount(PokerTable, {
        shallow: true,
        props: {uuid: 'table-uuid'},
        global: {
            plugins: [pinia],
            mocks: {$router: {push: vi.fn()}},
            mixins: [{methods: {setTitle: vi.fn()}}],
        },
    })

    it('shows loading (not the game) when game arrives before clientState', () => {
        root.game = {game: 'bourre', data: {}}
        root.clientState = null

        const wrapper = mountTable()
        expect(wrapper.findComponent(Loading).exists()).toBe(true)
        expect(wrapper.findComponent({name: 'StubGame'}).exists()).toBe(false)
    })

    it('mounts the game once clientState is present', () => {
        root.game = {game: 'bourre', data: {}}
        root.clientState = {1: {isConnected: true, active: true, player: {displayName: 'Alice'}}}

        const wrapper = mountTable()
        expect(wrapper.findComponent({name: 'StubGame'}).exists()).toBe(true)
        expect(wrapper.findComponent(Loading).exists()).toBe(false)
    })
})
