<template>
    <div>
        <div v-if="success">
            <p>Welcome to <strong>Monday Night Poker</strong>. You may now proceed to
                <router-link to="/login">log in</router-link>
                .
            </p>
        </div>
        <form v-else @submit.prevent="submit" class="min">
            <h2>Create an Account</h2>

            <loading v-if="loading"/>

            <transition name="error">
                <error :message="error" v-if="error"/>
            </transition>

            <label class="optional">
                <span>Display Name</span>
                <input type="text" autocomplete="off" v-model="displayName" placeholder="Timmy Two Times"
                       pattern="[\p{L}\p{N} ]+" :disabled="loading"/>
            </label>

            <input-with-confirm label="Email" autocomplete="email" v-model="email" placeholder="i.have.an.ace@email.domain" :disabled="loading" />
            <input-with-confirm label="Password" type="password" autocomplete="off" v-model="password" placeholder="hunter2" :disabled="loading" />

            <div class="buttons">
                <button type="submit" :disabled="submitDisabled">Sign Up</button>
            </div>

            <div class="log-in">
                Already have an account?
                <router-link to="/login">Log in</router-link>
            </div>
        </form>
    </div>
</template>

<script>
    import Loading from "@/components/Loading"
    import Error from "@/components/Error"
    import client from "@/client"
    import recaptcha from '@/recaptcha'
    import InputWithConfirm from "@/components/InputWithConfirm"

    export default {
        name: "SignUp",
        components: {InputWithConfirm, Error, Loading},
        data() {
            return {
                error: null,
                success: false,
                loading: false,
                displayName: '',
                email: {
                    primary: '',
                    confirm: '',
                },
                password: {
                    primary: '',
                    confirm: '',
                }
            }
        },
        computed: {
            submitDisabled() {
                return this.loading || !this.email.primary || !this.password.primary || this.email.primary !== this.email.confirm || this.password.primary !== this.password.confirm
            },
        },
        mounted() {
            this.recaptcha = recaptcha()
        },
        beforeDestroy() {
            this.recaptcha
                .then(r => r.remove())
        },
        methods: {
            submit() {
                this.error = null
                this.loading = true
                this.recaptcha
                    .then(r => r.execute('signup'))
                    .then(token => client.signUp(this.displayName, this.email.primary, this.password.primary, token))
                    .then(() => this.success = true)
                    .catch(err => this.error = err)
                    .finally(() => this.loading = false)
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import "../variables";

    form .loading {
        position: absolute;
        bottom:   $spacing-small;
        right:    $spacing-small;
    }

    .log-in {
        font-size:   0.8em;
        color:       $text-color-light;
        border-top:  1px solid $border-color;
        padding-top: $spacing;
        margin-top:  $spacing;
    }
</style>