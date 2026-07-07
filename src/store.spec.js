import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useRootStore } from './store'
import * as webSocket from './webSocket'

vi.mock('./webSocket', () => ({
    send: vi.fn(),
}))

beforeEach(() => {
    setActivePinia(createPinia())
})

describe('permission getters', () => {
    it('are all false with no user and no clientState', () => {
        const store = useRootStore()

        expect(store.isSiteAdmin).toBe(false)
        expect(store.userClientState).toBeFalsy()
        expect(store.isTableAdmin).toBe(false)
        expect(store.canStart).toBe(false)
        expect(store.canRestart).toBe(false)
        expect(store.canTerminate).toBe(false)
    })

    it('do not throw when the user is set but clientState has not arrived', () => {
        const store = useRootStore()
        store.setUser({jwt: 'j', player: {id: 1, isSiteAdmin: false}})

        expect(store.isTableAdmin).toBe(false)
        expect(store.canStart).toBe(false)
        expect(store.canRestart).toBe(false)
        expect(store.canTerminate).toBe(false)
    })

    it('reflect the player flags from clientState', () => {
        const store = useRootStore()
        store.setUser({jwt: 'j', player: {id: 1, isSiteAdmin: false}})
        store.setClientState({
            1: {isTableAdmin: false, canStart: true, canRestart: false, canTerminate: false},
        })

        expect(store.isTableAdmin).toBe(false)
        expect(store.canStart).toBe(true)
        expect(store.canRestart).toBe(false)
    })

    it('grant everything to site admins', () => {
        const store = useRootStore()
        store.setUser({jwt: 'j', player: {id: 1, isSiteAdmin: true}})

        expect(store.isSiteAdmin).toBe(true)
        expect(store.isTableAdmin).toBe(true)
        expect(store.canStart).toBe(true)
        expect(store.canRestart).toBe(true)
        expect(store.canTerminate).toBe(true)
    })
})

describe('addLogs', () => {
    it('does not throw when logs arrive before clientState', () => {
        const store = useRootStore()
        store.addLogs([{message: '{} did something', playerIds: [42]}])

        expect(store.logs).toHaveLength(1)
        expect(store.logs[0].message).toBe(' did something')
    })

    it('substitutes player names and currency tokens', () => {
        const store = useRootStore()
        store.setClientState({42: {player: {displayName: 'Alice'}}})
        store.addLogs([{message: '{} bet ${250}', playerIds: [42]}])

        expect(store.logs[0].message).toBe('Alice bet $2.50')
    })

    it('dedupes logs by uuid', () => {
        const store = useRootStore()
        store.addLogs([{uuid: 'abc', message: 'once'}])
        store.addLogs([{uuid: 'abc', message: 'once'}])

        expect(store.logs).toHaveLength(1)
    })

    it('keeps only the most recent 100 logs', () => {
        const store = useRootStore()
        const logs = Array.from({length: 120}, (_, i) => ({uuid: `log-${i}`, message: `message ${i}`}))
        store.addLogs(logs)

        expect(store.logs).toHaveLength(100)
        expect(store.logs[0].message).toBe('message 20')
        expect(store.logs[99].message).toBe('message 119')
    })
})

describe('webSocketSend action', () => {
    it('proxies to the webSocket service and returns its promise', async () => {
        webSocket.send.mockResolvedValue({key: 'status', value: 'OK'})

        const result = await useRootStore().webSocketSend({
            action: 'playerStatus',
            additionalData: {active: true},
        })

        expect(webSocket.send).toHaveBeenCalledWith('playerStatus', null, null, {active: true})
        expect(result).toMatchObject({key: 'status'})
    })

    it('propagates rejections to the caller', async () => {
        webSocket.send.mockRejectedValue(new Error('not connected to the table'))

        await expect(useRootStore().webSocketSend({action: 'anything'}))
            .rejects.toThrow('not connected to the table')
    })
})
