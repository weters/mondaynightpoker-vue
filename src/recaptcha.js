const siteKey = process.env.VUE_APP_SITE_KEY
const baseURL = 'https://www.google.com/recaptcha/api.js?render='

function execute(action) {
    /*global grecaptcha*/
    return new Promise((resolve, reject) => { // eslint-disable-line
        grecaptcha.ready(function () {
            try {
                grecaptcha.execute(siteKey, {action})
                    .then(resolve)
            } catch (err) {
                reject(err)
            }
        })
    })
}

if (!siteKey) {
    throw new Error('VUE_APP_SITE_KEY not provided')
}

export default () => new Promise((resolve, reject) => {
    const url = `${baseURL}${encodeURIComponent(siteKey)}`
    const scriptTag = document.body.appendChild(document.createElement('script'))
    scriptTag.setAttribute('async', '')
    scriptTag.setAttribute('src', url)
    scriptTag.addEventListener('load', () => resolve({
        remove() {
            scriptTag.remove()

            document.querySelectorAll('script')
                .forEach(el => {
                    if (el.getAttribute('src').match(new RegExp('gstatic.com/recaptcha'))) {
                        el.remove()
                    }
                })

            document.querySelector('div.grecaptcha-badge')
                .parentElement
                .remove()
        },
        execute
    }))
    scriptTag.addEventListener('error', reject)
})
