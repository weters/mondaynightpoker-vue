import { watch } from 'vue'
import client from "@/client"
import { useRootStore } from "@/store"
import { loadStoredUser, saveStoredUser, clearStoredUser } from "@/session"

// half-life of the 30-day server token; refresh once a token is older than this
const refreshAfterSeconds = 15 * 24 * 3600

function clearUser(store) {
    clearStoredUser()
    store.clearUser()
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

function refreshIfNeeded(store, jwt) {
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
        .then(({jwt, player}) => store.setUser({jwt, player}))
        .catch(err => console.error('token refresh failed', err))
}

// initAuth restores the persisted session and keeps it in sync with the store.
// It must run after pinia is installed and before the app mounts.
export function initAuth() {
    const store = useRootStore()

    try {
        const data = loadStoredUser()
        store.setUser(data)
        client.validateJWT(data.jwt)
            .then(() => refreshIfNeeded(store, data.jwt))
            .catch(err => {
                console.error(err)
                clearUser(store)
            })
    } catch {
        clearUser(store)
    }

    watch(() => store.user, saveStoredUser)
}
