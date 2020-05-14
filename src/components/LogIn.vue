<template>
    <form @submit.prevent="submit" class="hide-required">

        <h2>Log In</h2>

        <loading v-if="loading" />

        <transition name="error">
            <error :message="error" v-if="error"/>
        </transition>

        <label>
            <span>Email Address</span>
            <input type="text" placeholder="Email Address" autocomplete="email" required v-model="email"/>
        </label>

        <label>
            <span>Password</span>
            <input type="password" placeholder="Password" autocomplete="current-password" required v-model="password"/>
        </label>

        <div class="buttons">
            <button type="submit" :disabled="submitDisabled">Log In</button>
        </div>

        <div class="no-account">
            Don't have an account? <router-link to="/signup">Sign up</router-link>
        </div>
    </form>
</template>

<script>
    import client from "@/client"
    import Loading from "@/components/Loading"
    import Error from "@/components/Error"

    export default {
        name: "LogIn",
        components: {Error, Loading},
        data() {
            return {
                email: null,
                password: null,
                loading: false,
                error: null,
            }
        },
        mounted() {
            this.$store.commit('clearUser')
        },
        computed: {
            submitDisabled() {
                return this.loading || !this.email || !this.password
            },
        },
        methods: {
            submit() {
                this.error = null
                this.loading = true
                client.logIn(this.email, this.password)
                    .then(res => {
                        this.$store.commit('setUser', res)
                        this.$router.push('/')
                    })
                    .catch(err => this.error = err)
                    .finally(() => this.loading = false)
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import '../variables';

    form .loading {
        position: absolute;
        bottom:   $spacing-small;
        right:    $spacing-small;
    }

    div.no-account {
        font-size: 0.8em;
        border-top: 1px solid $border-color;
        color: $text-color-light;
        padding-top: $spacing;
        margin-top: $spacing;
    }
</style>
