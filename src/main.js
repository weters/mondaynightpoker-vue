import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import Welcome from "@/components/Welcome"
import store from './store'
import LogIn from "@/components/LogIn"
import Admin from "@/components/Admin"
import SignUp from "@/components/SignUp"
import PokerTable from "@/components/PokerTable"
import './auth'
import JoinTable from "@/components/JoinTable"
import TableList from "@/components/TableList"
import relDate from 'relative-date'

Vue.use(VueRouter)

Vue.config.productionTip = false

const routes = [
    {path: '/', component: Welcome, meta: {protected: false}},
    {path: '/login', component: LogIn, meta: {protected: false}},
    {path: '/logout', component: LogIn, meta: {protected: false}},
    {path: '/signup', component: SignUp, meta: {protected: false}},

    {path: '/table', component: TableList },
    {path: '/table/:uuid', component: PokerTable, props: true},
    {path: '/table/:uuid/join', component: JoinTable, props: true},

    {path: '/admin', component: Admin, meta: {adminOnly: true}},
]

const router = new VueRouter({
    routes,
    mode: 'history',
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
        next('/login')
        return
    }

    next()
})

Vue.mixin({
    methods: {
        relativeDate: date => relDate(new Date(date))
    }
})

new Vue({
    render: h => h(App),
    router,
    store,
}).$mount('#app')
