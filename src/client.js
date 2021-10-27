import store from './store'

const baseURL = process.env.VUE_APP_API_URL || 'http://localhost:5080'
const withAuthorization = true

class Client {
    logIn(email, password) {
        return this._post(`/player/auth`, {
            email,
            password,
        })
    }

    signUp(displayName, email, password, token) {
        return this._post(`/player`, {
            displayName,
            email,
            password,
            token
        })
    }

    joinTable(uuid) {
        return this._post(`/table/${encodeURIComponent(uuid)}/seat`, null, withAuthorization)
    }

    listTables(start = 0, rows = 100) {
        return this._get(`/table` + this._query({ start, rows }), withAuthorization)
    }

    getTableByUUID(uuid) {
        return this._get(`/table/${encodeURIComponent(uuid)}`, withAuthorization)
    }

    createTable(name) {
        return this._post(`/table`, {
            name,
        }, withAuthorization)
    }

    updatePlayer(playerId, { email, displayName, newPassword, oldPassword }) {
        return this._post(`/player/${encodeURIComponent(playerId)}`, {
            email,
            displayName,
            newPassword,
            oldPassword,
        }, withAuthorization)
    }

    getPlayers(search = "", start = 0, rows = 100) {
        return this._get(`/player?start=${encodeURIComponent(start)}&rows=${encodeURIComponent(rows)}&search=${encodeURIComponent(search)}`, withAuthorization)
    }

    changePassword(playerId, password) {
        return this._post(`/admin/player/${encodeURIComponent(playerId)}`, {
            key: "password",
            value: password,
        }, withAuthorization)
    }

    checkResetPasswordToken(token) {
        return this._get(`/player/reset-password/${encodeURIComponent(token)}`)
    }

    requestPasswordReset(email) {
        return this._post(`/player/reset-password-request`, {
            email,
        })
    }

    resetPassword(email, password, token) {
        return this._post(`/player/reset-password/${encodeURIComponent(token)}`, {
            email, password
        })
    }

    verifyAccount(token) {
        return this._post(`/player/verify/${encodeURIComponent(token)}`)
    }

    validateJWT(jwt) {
        return this._get(`/player/auth/${jwt}`)
    }

    getServerInfo() {
        return this._get(`/health`)
    }

    deleteAccount(playerId) {
        return this._delete(`/player/${encodeURIComponent(playerId)}`, true)
    }

    getTables(start, rows) {
        return this._get(`/admin/table` + this._query({ start, rows }), true)
    }

    _get(path, withAuthorization = false) {
        return this._do(path, {}, withAuthorization)
    }

    _delete(path, withAuthorization = false) {
        return this._do(path, {
            method: 'DELETE',
        }, withAuthorization)
    }

    _post(path, payload, withAuthorization = false) {
        return this._do(path, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        }, withAuthorization)
    }

    _do(path, init = {}, withAuthorization = false) {
        if (withAuthorization) {
            const jwt = store.state.user && store.state.user.jwt
            if (!jwt) {
                return Promise.reject(new Error('user is not authorized'))
            }

            if (!('headers' in init)) {
                init.headers = {}
            }

            init.headers.Authorization = `Bearer ${jwt}`
        }

        return fetch(`${baseURL}${path}`, init).then(async res => {
            if (res.status >= 400) {
                const respObj = await res.json()
                throw new Error(respObj.message || res.statusText)
            }

            return res.json()
        })
    }

    _query(options) {
        const keys = Object.keys(options).sort()
        if (!keys.length) {
            return ''
        }

        return '?' + keys.map(k => encodeURIComponent(k) + '=' + encodeURIComponent(options[k])).join('&')
    }
}

export default new Client()