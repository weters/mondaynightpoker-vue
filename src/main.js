import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { initAuth } from './auth'
import relDate from 'relative-date'
import {formatAmount} from "@/currency"

const app = createApp(App)

app.use(router)
app.use(createPinia())

initAuth()

// Global mixin for methods
app.mixin({
    beforeMount() {
        const title = this.$options.title
        if (title) {
            let pageTitle = typeof title === 'function' ? title.call(this) : title
            this.setTitle(pageTitle)
        }
    },
    methods: {
        relativeDate: date => relDate(new Date(date)),
        setTitle(title) {
            document.title = title === 'Monday Night Poker' ? 'Monday Night Poker' : `${ title } | Monday Night Poker`
        },
        replaceTokens(string) {
            return string.replace(/\${(-?\d+)}/g, (match, cents) => formatAmount(cents))
        }
    }
})

app.mount('#app')
