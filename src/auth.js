import client from "@/client"
import store from "@/store"
import { loadStoredUser, saveStoredUser, clearStoredUser } from "@/session"

// half-life of the 30-day server token; refresh once a token is older than this
const refreshAfterSeconds = 15 * 24 * 3600

function clearUser() {
    clearStoredUser()
    store.commit('clearUser')
}

// jwtClaims decodes a JWT payload without verifying it (the server verifies)
export function jwtClaims(jwt) {
    const b64 = jwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(b64))
}

// shouldRefresh reports whether the token is past its half-life. Tokens without
// an expiry (issued before expiry existed) always refresh so they rotate onto
// expiring ones.
export function shouldRefresh({iat, exp}, nowSeconds = Date.now() / 1000) {
    if (!exp) {
        return true
    }

    return nowSeconds - iat > refreshAfterSeconds
}

function refreshIfNeeded(jwt) {
    let claims
    try {
        claims = jwtClaims(jwt)
    } catch {
        return
    }

    if (!shouldRefresh(claims)) {
        return
    }

    client.refreshAuth()
        .then(({jwt, player}) => store.commit('setUser', {jwt, player}))
        .catch(err => console.error('token refresh failed', err))
}

try {
    const data = loadStoredUser()
    store.commit('setUser', data)
    client.validateJWT(data.jwt)
        .then(() => refreshIfNeeded(data.jwt))
        .catch(err => {
            console.error(err)
            clearUser()
        })
} catch (err) {
    clearUser(err)
}

store.watch(state => state.user, saveStoredUser)
