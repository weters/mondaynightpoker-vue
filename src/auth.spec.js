import { describe, it, expect } from 'vitest'
import { jwtClaims, shouldRefresh } from './auth'

function makeJWT(claims) {
    const b64 = s => btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    return `${b64('{"alg":"RS256"}')}.${b64(JSON.stringify(claims))}.signature`
}

describe('jwtClaims', () => {
    it('decodes the payload without verification', () => {
        const jwt = makeJWT({sub: '42', iat: 1700000000, exp: 1702592000})
        expect(jwtClaims(jwt)).toEqual({sub: '42', iat: 1700000000, exp: 1702592000})
    })
})

describe('shouldRefresh', () => {
    const day = 24 * 3600

    it('refreshes legacy tokens without an expiry', () => {
        expect(shouldRefresh({iat: 1700000000}, 1700000001)).toBe(true)
    })

    it('does not refresh a token younger than its half-life', () => {
        const iat = 1700000000
        expect(shouldRefresh({iat, exp: iat + 30 * day}, iat + 14 * day)).toBe(false)
    })

    it('refreshes a token older than its half-life', () => {
        const iat = 1700000000
        expect(shouldRefresh({iat, exp: iat + 30 * day}, iat + 16 * day)).toBe(true)
    })
})
