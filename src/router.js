import { createRouter, createWebHistory } from 'vue-router'
import { useRootStore } from './store'

// Routes are lazy-loaded so each page ships as its own chunk. Auth is explicit:
// routes without meta are public; requiresAuth needs a logged-in user;
// requiresAdmin needs a site admin (and implies requiresAuth).
const routes = [
    {path: '/', component: () => import('@/components/Welcome.vue')},
    {path: '/login', component: () => import('@/components/LogIn.vue')},
    {path: '/logout', component: () => import('@/components/LogIn.vue')},
    {path: '/signup', component: () => import('@/components/SignUp.vue')},
    {path: '/verify-account/:token', component: () => import('@/components/VerifyAccount.vue'), props: true},
    {path: '/forgot-password', component: () => import('@/components/ForgotPassword.vue')},
    {path: '/reset-password/:token', component: () => import('@/components/ResetPassword.vue'), props: true},

    {path: '/my-profile', component: () => import('@/components/Profile.vue'), meta: {requiresAuth: true}},
    {path: '/my-tables', component: () => import('@/components/MyTables.vue'), meta: {requiresAuth: true}},
    {path: '/table/create', component: () => import('@/components/admin/CreateTable.vue'), meta: {requiresAuth: true}},
    {path: '/table/:uuid', component: () => import('@/components/PokerTable.vue'), props: true, meta: {requiresAuth: true}},
    {path: '/table/:uuid/join', component: () => import('@/components/JoinTable.vue'), props: true, meta: {requiresAuth: true}},

    {path: '/admin', component: () => import('@/components/admin/Admin.vue'), meta: {requiresAdmin: true}},
    {path: '/admin/players', component: () => import('@/components/admin/AdminPlayers.vue'), meta: {requiresAdmin: true}},
    {path: '/admin/players/:id', component: () => import('@/components/PlayerProfile.vue'), props: true, meta: {requiresAdmin: true}},
    {path: '/admin/tables', component: () => import('@/components/admin/AdminTables.vue'), meta: {requiresAdmin: true}},
]

const router = createRouter({
    routes,
    history: createWebHistory(),
})

router.beforeEach(to => {
    // useRootStore must be called inside the guard: the router is created before pinia
    const store = useRootStore()

    if (to.meta.requiresAdmin && !store.isSiteAdmin) {
        return '/'
    }

    if ((to.meta.requiresAuth || to.meta.requiresAdmin) && !store.user) {
        return '/login?redirect=' + encodeURIComponent(to.fullPath)
    }
})

export default router
