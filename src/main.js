import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import './auth'
import relDate from 'relative-date'
import {formatAmount} from "@/currency"

const app = createApp(App)

app.use(router)
app.use(store)

// Global mixin for methods
app.mixin({
    methods: {
        relativeDate: date => relDate(new Date(date)),
        setTitle(title) {
            document.title = title === 'Monday Night Poker' ? 'Monday Night Poker' : `${ title } | Monday Night Poker`
        },
        replaceTokens(string) {
            return string.replace(/\${(-?\d+)}/g, (match, cents) => formatAmount(cents))
        }
    },
    beforeMount() {
        const title = this.$options.title
        if (title) {
            let pageTitle = typeof title === 'function' ? title.call(this) : title
            this.setTitle(pageTitle)
        }
    }
})

app.mount('#app')
