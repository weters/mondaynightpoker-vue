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
        renameTable: vi.fn(),
    },
}))
// Any slug maps to a stub game component so gameComponent is truthy.
vi.mock('@/games', () => ({
    default: [],
    componentForSlug: () => ({name: 'StubGame', render: () => null}),
}))

import PokerTable from './PokerTable.vue'
import Loading from './Loading.vue'
import client from '@/client'

describe('PokerTable', () => {
    let pinia, root

    beforeEach(() => {
        vi.clearAllMocks()
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

    describe('renaming the table', () => {
        const clientState = isTableAdmin => ({
            1: {isConnected: true, active: true, isTableAdmin, player: {displayName: 'Alice'}},
        })

        const mountWithTable = async () => {
            const wrapper = mountTable()
            await wrapper.setData({table: {uuid: 'table-uuid', name: 'Original Name'}})
            return wrapper
        }

        it('does not offer rename to non-admins', async () => {
            root.clientState = clientState(false)

            const wrapper = await mountWithTable()
            expect(wrapper.find('button.table-name').exists()).toBe(false)
            expect(wrapper.find('span.table-name').text()).toBe('Original Name')
        })

        it('replaces the name with an edit form when a table admin taps it', async () => {
            root.clientState = clientState(true)

            const wrapper = await mountWithTable()
            expect(wrapper.find('form.rename-form').exists()).toBe(false)

            await wrapper.find('button.table-name').trigger('click')
            expect(wrapper.find('form.rename-form').exists()).toBe(true)
            expect(wrapper.vm.editName).toBe('Original Name')
        })

        it('cancel closes the form without saving', async () => {
            root.clientState = clientState(true)

            const wrapper = await mountWithTable()
            await wrapper.find('button.table-name').trigger('click')
            await wrapper.setData({editName: 'Changed'})

            await wrapper.find('form.rename-form button.secondary').trigger('click')
            expect(wrapper.find('form.rename-form').exists()).toBe(false)
            expect(wrapper.vm.tableName).toBe('Original Name')
            expect(client.renameTable).not.toHaveBeenCalled()
        })

        it('save renames the table and closes the form', async () => {
            root.clientState = clientState(true)
            client.renameTable.mockResolvedValueOnce({uuid: 'table-uuid', name: 'New Name'})

            const wrapper = await mountWithTable()
            await wrapper.find('button.table-name').trigger('click')
            await wrapper.setData({editName: '  New Name '})

            await wrapper.find('form.rename-form').trigger('submit')
            await vi.waitFor(() => expect(wrapper.vm.editingName).toBe(false))

            expect(client.renameTable).toHaveBeenCalledWith('table-uuid', 'New Name')
            expect(wrapper.vm.tableName).toBe('New Name')
        })

        it('save without a change skips the API call', async () => {
            root.clientState = clientState(true)

            const wrapper = await mountWithTable()
            await wrapper.find('button.table-name').trigger('click')
            await wrapper.find('form.rename-form').trigger('submit')

            expect(client.renameTable).not.toHaveBeenCalled()
            expect(wrapper.find('form.rename-form').exists()).toBe(false)
        })

        it('shows an error and keeps the form open when the rename fails', async () => {
            root.clientState = clientState(true)
            client.renameTable.mockRejectedValueOnce('something went wrong')

            const wrapper = await mountWithTable()
            await wrapper.find('button.table-name').trigger('click')
            await wrapper.setData({editName: 'New Name'})

            await wrapper.find('form.rename-form').trigger('submit')
            await vi.waitFor(() => expect(wrapper.vm.renameError).toBe('something went wrong'))

            expect(wrapper.find('form.rename-form').exists()).toBe(true)
            expect(wrapper.vm.tableName).toBe('Original Name')
        })
    })
})
