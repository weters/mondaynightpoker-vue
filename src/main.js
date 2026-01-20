import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Welcome from "@/components/Welcome.vue"
import store from './store'
import LogIn from "@/components/LogIn.vue"
import Admin from "@/components/admin/Admin.vue"
import SignUp from "@/components/SignUp.vue"
import PokerTable from "@/components/PokerTable.vue"
import './auth'
import JoinTable from "@/components/JoinTable.vue"
import relDate from 'relative-date'
import Profile from "./components/Profile.vue"
import MyTables from "@/components/MyTables.vue"
import CreateTable from "@/components/admin/CreateTable.vue"
import ForgotPassword from "@/components/ForgotPassword.vue"
import ResetPassword from "@/components/ResetPassword.vue"
import VerifyAccount from "@/components/VerifyAccount.vue"
import AdminPlayers from "@/components/admin/AdminPlayers.vue"
import AdminTables from "@/components/admin/AdminTables.vue"
import {formatAmount} from "@/currency"

const routes = [
    {path: '/', component: Welcome, meta: {protected: false}},
    {path: '/login', component: LogIn, meta: {protected: false}},
    {path: '/logout', component: LogIn, meta: {protected: false}},
    {path: '/signup', component: SignUp, meta: {protected: false}},
    {path: '/verify-account/:token', component: VerifyAccount, props: true, meta: {protected: false}},
    {path: '/forgot-password', component: ForgotPassword, meta: {protected: false}},
    {path: '/reset-password/:token', component: ResetPassword, props: true, meta: {protected: false}},

    {path: '/my-profile', component: Profile },
    {path: '/my-tables', component: MyTables },
    {path: '/table/create', component: CreateTable },
    {path: '/table/:uuid', component: PokerTable, props: true},
    {path: '/table/:uuid/join', component: JoinTable, props: true},

    {path: '/admin', component: Admin, meta: {adminOnly: true}},
    {path: '/admin/players', component: AdminPlayers, meta: {adminOnly: true}},
    {path: '/admin/tables', component: AdminTables, meta: {adminOnly: true}},
]

const router = createRouter({
    routes,
    history: createWebHistory(),
})

router.beforeEach((to, from, next) => {
    if (to.meta.adminOnly) {
        if (!store.getters.isSiteAdmin) {
            next('/')
            return
        }
    }

    if ('protected' in to.meta && !to.meta.protected) {
        next()
        return
    }

    if (!store.state.user) {
        const redirect = document.location.pathname + document.location.search
        next('/login?redirect=' + encodeURIComponent(redirect))
        return
    }

    next()
})

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
