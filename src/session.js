// session owns the persisted login in localStorage. It exists so client.js and
// auth.js can share it without importing each other.

const key = 'user'

// loadStoredUser returns the persisted {jwt, player} or null
export function loadStoredUser() {
    try {
        return JSON.parse(localStorage.getItem(key))
    } catch {
        return null
    }
}

// saveStoredUser persists the user to localStorage
export function saveStoredUser(user) {
    localStorage.setItem(key, JSON.stringify(user))
}

// clearStoredUser removes the persisted user
export function clearStoredUser() {
    localStorage.removeItem(key)
}
