import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import client from './client'
import store from './store'

describe('client 401 handling', () => {
    beforeEach(() => {
        store.commit('setUser', {jwt: 'test-jwt', player: {id: 1}})
    })

    afterEach(() => {
        vi.unstubAllGlobals()
        store.commit('clearUser')
    })

    it('clears the session and redirects on a 401 from an authorized call', async () => {
        const assign = vi.fn()
        vi.stubGlobal('location', {...window.location, pathname: '/my-tables', search: '', assign})
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({status: 401, json: async () => ({})}))
        localStorage.setItem('user', '{"jwt":"test-jwt"}')

        await expect(client.listTables()).rejects.toThrow('session expired')
        expect(localStorage.getItem('user')).toBeNull()
        expect(assign).toHaveBeenCalledWith('/login?redirect=%2Fmy-tables')
    })

    it('surfaces a 401 from log-in as a normal error', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            status: 401,
            json: async () => ({message: 'invalid email address or password'}),
        }))

        await expect(client.logIn('a@b.c', 'nope')).rejects.toThrow('invalid email address or password')
    })

    it('passes non-401 errors through unchanged', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            status: 500,
            json: async () => ({message: 'boom'}),
        }))

        await expect(client.listTables()).rejects.toThrow('boom')
    })
})
