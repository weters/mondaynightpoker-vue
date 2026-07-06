import { describe, it, expect, vi, beforeEach } from 'vitest'
import store from './store'
import * as webSocket from './webSocket'

vi.mock('./webSocket', () => ({
    send: vi.fn(),
}))

function resetStore() {
    store.commit('clearUser')
    store.commit('setClientState', null)
    store.commit('clearGame')
    store.commit('clearLogs')
}

describe('permission getters', () => {
    beforeEach(resetStore)

    it('are all false with no user and no clientState', () => {
        expect(store.getters.isSiteAdmin).toBe(false)
        expect(store.getters.userClientState).toBeFalsy()
        expect(store.getters.isTableAdmin).toBe(false)
        expect(store.getters.canStart).toBe(false)
        expect(store.getters.canRestart).toBe(false)
        expect(store.getters.canTerminate).toBe(false)
    })

    it('do not throw when the user is set but clientState has not arrived', () => {
        store.commit('setUser', {jwt: 'j', player: {id: 1, isSiteAdmin: false}})

        expect(store.getters.isTableAdmin).toBe(false)
        expect(store.getters.canStart).toBe(false)
        expect(store.getters.canRestart).toBe(false)
        expect(store.getters.canTerminate).toBe(false)
    })

    it('reflect the player flags from clientState', () => {
        store.commit('setUser', {jwt: 'j', player: {id: 1, isSiteAdmin: false}})
        store.commit('setClientState', {
            1: {isTableAdmin: false, canStart: true, canRestart: false, canTerminate: false},
        })

        expect(store.getters.isTableAdmin).toBe(false)
        expect(store.getters.canStart).toBe(true)
        expect(store.getters.canRestart).toBe(false)
    })

    it('grant everything to site admins', () => {
        store.commit('setUser', {jwt: 'j', player: {id: 1, isSiteAdmin: true}})

        expect(store.getters.isSiteAdmin).toBe(true)
        expect(store.getters.isTableAdmin).toBe(true)
        expect(store.getters.canStart).toBe(true)
        expect(store.getters.canRestart).toBe(true)
        expect(store.getters.canTerminate).toBe(true)
    })
})

describe('addLogs', () => {
    beforeEach(resetStore)

    it('does not throw when logs arrive before clientState', () => {
        store.commit('addLogs', [{message: '{} did something', playerIds: [42]}])

        expect(store.state.logs).toHaveLength(1)
        expect(store.state.logs[0].message).toBe(' did something')
    })

    it('substitutes player names and currency tokens', () => {
        store.commit('setClientState', {42: {player: {displayName: 'Alice'}}})
        store.commit('addLogs', [{message: '{} bet ${250}', playerIds: [42]}])

        expect(store.state.logs[0].message).toBe('Alice bet $2.50')
    })

    it('dedupes logs by uuid', () => {
        store.commit('addLogs', [{uuid: 'abc', message: 'once'}])
        store.commit('addLogs', [{uuid: 'abc', message: 'once'}])

        expect(store.state.logs).toHaveLength(1)
    })

    it('keeps only the most recent 100 logs', () => {
        const logs = Array.from({length: 120}, (_, i) => ({uuid: `log-${i}`, message: `message ${i}`}))
        store.commit('addLogs', logs)

        expect(store.state.logs).toHaveLength(100)
        expect(store.state.logs[0].message).toBe('message 20')
        expect(store.state.logs[99].message).toBe('message 119')
    })
})

describe('webSocketSend action', () => {
    it('proxies to the webSocket service and returns its promise', async () => {
        webSocket.send.mockResolvedValue({key: 'status', value: 'OK'})

        const result = await store.dispatch('webSocketSend', {
            action: 'playerStatus',
            additionalData: {active: true},
        })

        expect(webSocket.send).toHaveBeenCalledWith('playerStatus', null, null, {active: true})
        expect(result).toMatchObject({key: 'status'})
    })

    it('propagates rejections to the caller', async () => {
        webSocket.send.mockRejectedValue(new Error('not connected to the table'))

        await expect(store.dispatch('webSocketSend', {action: 'anything'}))
            .rejects.toThrow('not connected to the table')
    })
})
