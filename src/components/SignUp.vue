<template>
    <div>
        <div v-if="success">
            <p>Welcome to <strong>Monday Night Poker</strong>. You may now proceed to
                <router-link to="/login">log in</router-link>
                .
            </p>
        </div>
        <form v-else @submit.prevent="submit">
            <h2>Create an Account</h2>

            <loading v-if="loading"/>

            <transition name="error">
                <error :message="error" v-if="error"/>
            </transition>

            <label class="optional">
                <span>Display Name</span>
                <input type="text" autocomplete="off" v-model="displayName" placeholder="Timmy Two Times" pattern="[\p{L}\p{N} ]+" :disabled="loading"/>
            </label>

            <label>
                <span>Email</span>
                <input type="email" autocomplete="email" v-model="email" placeholder="ihaveanace@email.domain" required :disabled="loading"/>
            </label>

            <label>
                <span class="container">
                    <span>Confirm Email</span>
                    <transition name="alert"><mdi-icon :icon="mdiAlertCircle" v-if="emailMismatch"/></transition>
                </span>
                <input type="email" autocomplete="email" v-model="confirmEmail" placeholder="ihaveanace@email.domain" required :disabled="loading"/>
            </label>

            <label>
                <span>Password</span>
                <input type="password" autocomplete="off" v-model="password" placeholder="hunter2" required :disabled="loading"/>
            </label>

            <label>
                <span class="container">
                    <span>Confirm Password</span>
                    <transition name="alert"><mdi-icon :icon="mdiAlertCircle" v-if="passwordMismatch"/></transition>
                </span>
                <input type="password" autocomplete="off" v-model="confirmPassword" placeholder="hunter2" required :disabled="loading"/>
            </label>

            <div class="buttons">
                <button type="submit" :disabled="submitDisabled">Sign Up</button>
            </div>

            <div class="log-in">
                Already have an account? <router-link to="/login">Log in</router-link>
            </div>
        </form>
    </div>
</template>

<script>
    import Loading from "@/components/Loading"
    import Error from "@/components/Error"
    import client from "@/client"
    import {mdiAlertCircle} from '@mdi/js'
    import MdiIcon from "@/components/MdiIcon"

    export default {
        name: "SignUp",
        components: {MdiIcon, Error, Loading},
        data() {
            return {
                mdiAlertCircle,
                error: null,
                success: false,
                loading: false,
                displayName: '',
                email: '',
                confirmEmail: '',
                emailMismatch: false,
                password: '',
                confirmPassword: '',
                passwordMismatch: false,
            }
        },
        computed: {
            submitDisabled() {
                return this.loading || !this.email || !this.password || this.email !== this.confirmEmail || this.password !== this.confirmPassword
            },
        },
        methods: {
            submit() {
                this.error = null
                this.loading = true
                client.signUp(this.displayName, this.email, this.password)
                    .then(() => this.success = true)
                    .catch(err => this.error = err)
                    .finally(() => this.loading = false)
            },
        },
        watch: {
            email(newValue) {
                if (this.confirmEmail.length === 0) {
                    this.emailMismatch = false
                    return
                }

                this.emailMismatch = newValue !== this.confirmEmail
            },
            confirmEmail(newValue) {
                this.emailMismatch = this.email !== newValue
            },
            password(newValue) {
                if (this.confirmPassword.length === 0) {
                    this.passwordMismatch = false
                    return
                }

                this.passwordMismatch = newValue !== this.confirmPassword
            },
            confirmPassword(newValue) {
                this.passwordMismatch = this.password !== newValue
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import "../variables";

    label {
        & > span > span {
            vertical-align: middle;
        }

        ::v-deep svg {
            vertical-align: middle;
            width:          1em;
            height:         1em;
            margin-left:    $spacing-small;
            fill:           $alert;
        }
    }

    .alert-enter-active {
        transition: opacity 400ms, transform 200ms;
    }
    .alert-leave-active {
        transition: opacity 200ms, transform 400ms;
    }

    .alert-enter, .alert-leave-to {
        transform: translateY(100%);
        opacity: 0;
    }

    form .loading {
        position: absolute;
        bottom: $spacing-small;
        right: $spacing-small;
    }

    .log-in {
        font-size: 0.8em;
        color: $text-color-light;
        border-top: 1px solid $border-color;
        padding-top: $spacing;
        margin-top: $spacing;
    }
</style>