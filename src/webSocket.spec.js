import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { WebSocketClient, connect, disconnect, send } from './webSocket'

class MockWebSocket {
    static instances = []

    constructor(url) {
        this.url = url
        this.sent = []
        this.closed = false
        this.closeCode = null
        MockWebSocket.instances.push(this)
    }

    send(data) {
        this.sent.push(data)
    }

    close(code) {
        this.closed = true
        this.closeCode = code
    }
}

function makeStore() {
    return {
        state: {user: {jwt: 'test-jwt', player: {id: 1}}},
        commit: vi.fn(),
        dispatch: vi.fn(),
    }
}

function lastSocket() {
    return MockWebSocket.instances[MockWebSocket.instances.length - 1]
}

describe('WebSocketClient', () => {
    beforeEach(() => {
        vi.useFakeTimers()
        vi.stubGlobal('WebSocket', MockWebSocket)
        MockWebSocket.instances = []
    })

    afterEach(() => {
        vi.unstubAllGlobals()
        vi.useRealTimers()
    })

    it('throws when the user is not logged in', () => {
        expect(() => new WebSocketClient('uuid', {state: {user: null}})).toThrow('logged in user not found')
    })

    it('connects with the table uuid and access token', () => {
        new WebSocketClient('table-1', makeStore())
        expect(lastSocket().url).toContain('/table/table-1/ws?access_token=test-jwt')
    })

    describe('send', () => {
        it('resolves when the server replies with the same context', async () => {
            const client = new WebSocketClient('t', makeStore())
            const ws = lastSocket()

            const promise = client.send('someAction', 'someSubject')
            const {context} = JSON.parse(ws.sent[0])

            ws.onmessage({data: JSON.stringify({context, key: 'status', value: 'OK'})})
            await expect(promise).resolves.toMatchObject({key: 'status', value: 'OK'})
        })

        it('rejects when the server replies with an error, formatting currency tokens', async () => {
            const client = new WebSocketClient('t', makeStore())
            const ws = lastSocket()

            const promise = client.send('someAction')
            const {context} = JSON.parse(ws.sent[0])

            ws.onmessage({data: JSON.stringify({context, key: 'error', value: 'you need at least ${500}'})})
            await expect(promise).rejects.toThrow('you need at least $5')
        })

        it('rejects when the server does not reply in time', async () => {
            const client = new WebSocketClient('t', makeStore())

            const promise = client.send('someAction')
            const assertion = expect(promise).rejects.toThrow('did not receive response from server')
            vi.advanceTimersByTime(2000)
            await assertion
        })

        it('rejects all pending requests when the connection closes', async () => {
            const client = new WebSocketClient('t', makeStore())
            const ws = lastSocket()

            const p1 = client.send('one')
            const p2 = client.send('two')
            const a1 = expect(p1).rejects.toThrow('connection closed')
            const a2 = expect(p2).rejects.toThrow('connection closed')

            ws.onclose({wasClean: false})
            await Promise.all([a1, a2])
        })
    })

    describe('reconnect', () => {
        it('clears the game and reconnects with exponential backoff', () => {
            const store = makeStore()
            new WebSocketClient('t', store)
            expect(MockWebSocket.instances).toHaveLength(1)

            lastSocket().onclose({wasClean: false})
            expect(store.commit).toHaveBeenCalledWith('clearGame')

            vi.advanceTimersByTime(1000)
            expect(MockWebSocket.instances).toHaveLength(2)

            // the second attempt waits twice as long
            lastSocket().onclose({wasClean: false})
            vi.advanceTimersByTime(1000)
            expect(MockWebSocket.instances).toHaveLength(2)
            vi.advanceTimersByTime(1000)
            expect(MockWebSocket.instances).toHaveLength(3)
        })

        it('caps the retry delay at 30 seconds', () => {
            const client = new WebSocketClient('t', makeStore())

            for (let i = 0; i < 10; i++) {
                lastSocket().onclose({wasClean: false})
                vi.advanceTimersByTime(30000)
            }

            expect(client.retryDelay).toBeLessThanOrEqual(30000)
        })

        it('resets the retry delay once a connection opens', () => {
            const client = new WebSocketClient('t', makeStore())

            lastSocket().onclose({wasClean: false})
            vi.advanceTimersByTime(1000)
            expect(client.retryDelay).toBeGreaterThan(1000)

            lastSocket().onopen()
            expect(client.retryDelay).toBe(1000)
        })

        it('reconnects on a clean server-initiated close (e.g. slow-consumer disconnect)', () => {
            new WebSocketClient('t', makeStore())

            lastSocket().onclose({wasClean: true})
            vi.advanceTimersByTime(1000)
            expect(MockWebSocket.instances).toHaveLength(2)
        })

        it('does not reconnect after an intentional close', () => {
            const client = new WebSocketClient('t', makeStore())

            client.close()
            lastSocket().onclose({wasClean: true})
            vi.advanceTimersByTime(60000)
            expect(MockWebSocket.instances).toHaveLength(1)
            expect(lastSocket().closeCode).toBe(1000)
        })

        it('stops retrying when the user is no longer logged in', () => {
            const store = makeStore()
            new WebSocketClient('t', store)

            store.state.user = null
            lastSocket().onclose({wasClean: false})
            vi.advanceTimersByTime(60000)
            expect(MockWebSocket.instances).toHaveLength(1)
        })
    })

    describe('message dispatch', () => {
        let ws, store

        beforeEach(() => {
            store = makeStore()
            new WebSocketClient('t', store)
            ws = lastSocket()
        })

        const receive = message => ws.onmessage({data: JSON.stringify(message)})

        it('commits clientState', () => {
            receive({key: 'clientState', data: {1: {}}})
            expect(store.commit).toHaveBeenCalledWith('setClientState', {1: {}})
        })

        it('commits the game with value, data, and rules', () => {
            receive({key: 'game', value: 'guts', data: {gameState: {}}})
            expect(store.commit).toHaveBeenCalledWith('setGame', {game: 'guts', data: {gameState: {}}, rules: []})
        })

        it('clears the game when it ends', () => {
            receive({key: 'gameEnded'})
            expect(store.commit).toHaveBeenCalledWith('clearGame')
        })

        it('adds logs', () => {
            receive({key: 'logs', data: [{message: 'hi'}]})
            expect(store.commit).toHaveBeenCalledWith('addLogs', [{message: 'hi'}])
        })

        it('replaces logs on allLogs', () => {
            receive({key: 'allLogs', data: [{message: 'hi'}]})
            expect(store.commit).toHaveBeenCalledWith('clearLogs')
            expect(store.commit).toHaveBeenCalledWith('addLogs', [{message: 'hi'}])
        })

        it('dispatches scheduledGame', () => {
            receive({key: 'scheduledGame', data: {start: 'soon'}})
            expect(store.dispatch).toHaveBeenCalledWith('scheduledGame', {start: 'soon'})
        })

        it('dispatches unsolicited server errors to the store', () => {
            receive({key: 'error', value: 'something broke'})
            expect(store.dispatch).toHaveBeenCalledWith('error', 'something broke')
        })

        it('throws on unknown message keys', () => {
            expect(() => receive({key: 'bogus'})).toThrow('could not process message')
        })
    })
})

describe('singleton connection', () => {
    beforeEach(() => {
        vi.useFakeTimers()
        vi.stubGlobal('WebSocket', MockWebSocket)
        MockWebSocket.instances = []
    })

    afterEach(() => {
        disconnect()
        vi.unstubAllGlobals()
        vi.useRealTimers()
    })

    it('rejects sends when not connected', async () => {
        await expect(send('anything')).rejects.toThrow('not connected to the table')
    })

    it('closes the previous connection when connecting again', () => {
        const first = connect('t1', makeStore())
        connect('t2', makeStore())
        expect(first.closed).toBe(true)
        expect(MockWebSocket.instances).toHaveLength(2)
    })

    it('sends through the current connection', async () => {
        connect('t1', makeStore())
        const ws = lastSocket()

        const promise = send('someAction', 'subject', ['2s'], {amount: 100})
        const sent = JSON.parse(ws.sent[0])
        expect(sent).toMatchObject({action: 'someAction', subject: 'subject', cards: ['2s'], additionalData: {amount: 100}})

        ws.onmessage({data: JSON.stringify({context: sent.context, key: 'status'})})
        await expect(promise).resolves.toBeTruthy()
    })

    it('rejects sends after disconnecting', async () => {
        connect('t1', makeStore())
        disconnect()
        await expect(send('anything')).rejects.toThrow('not connected to the table')
    })
})
