import client from "@/client"
import store from "@/store"

const key = 'user'

function clearUser() {
    localStorage.removeItem(key)
    store.commit('clearUser')
}

function storeUser(user) {
    localStorage.setItem(key, JSON.stringify(user))
}

try {
    const data = JSON.parse(localStorage.getItem(key))
    store.commit('setUser', data)
    client.validateJWT(data.jwt)
        .then(() => {})
        .catch(err => {
            console.error(err)
            clearUser()
        })
} catch (err) {
    clearUser(err)
}

store.watch(state => state.user, storeUser)
