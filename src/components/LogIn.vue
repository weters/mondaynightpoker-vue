<template>
    <div class="log-in small-content hide-required">
        <form @submit.prevent="submit">

            <h2>Log in to Monday Night Poker</h2>

            <loading v-if="loading"/>

            <transition name="error">
                <error :message="error" v-if="error"/>
            </transition>

            <fancy-input type="text" label="Email Address" autocomplete="email" required hide-required v-model="email" />
            <fancy-input type="password" label="Password" autocomplete="current-password" required hide-required v-model="password" />

            <div class="buttons">
                <button type="submit" :disabled="submitDisabled">Log In</button>
            </div>

            <div class="help">
                <p>Don't have an account?
                    <router-link to="/signup">Sign up</router-link>
                </p>
                <p>Forgot password?
                    <router-link to="/forgot-password">Reset your password</router-link>
                </p>
            </div>
        </form>
    </div>
</template>

<script>
import client from "@/client"
import Loading from "@/components/Loading.vue"
import Error from "@/components/Error.vue"
import FancyInput from "@/components/formelements/FancyInput.vue"

export default {
    name: "LogIn",
    title: 'Log In',
    components: {FancyInput, Error, Loading},
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
            return this.loading
        },
    },
    methods: {
        submit() {
            this.error = null
            this.loading = true
            client.logIn(this.email, this.password)
                .then(res => {
                    this.$store.commit('setUser', res)

                    const redirect = this.$route.query.redirect || '/my-tables'
                    this.$router.push(redirect)
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

div.help {
    font-size:   0.8em;
    border-top:  1px solid $border-color;
    color:       $text-color-light;
    padding-top: $spacing;
    margin-top:  $spacing;

    p {
        margin: 0;
    }

    p:not(:first-child) {
        margin-top: $spacing-medium;
    }
}

div.forgot-password {
    font-size:  0.8em;
    margin-top: $spacing;
}
</style>
