<template>
    <div class="reset-password">
        <form @submit.prevent="submit" class="min hide-required">
            <h2>Reset Your Password</h2>

            <div class="password-changed" v-if="passwordChanged">
                <p>You have successfully changed your password. You may now proceed to <router-link to="/login">log in</router-link>.</p>
            </div>
            <div class="invalid-token" v-else-if="tokenIsValid === false">
                <p>The reset password URL is no longer valid. Please click <router-link to="/forgot-password">here</router-link> to request a new one to reset your password.</p>
            </div>
            <div class="valid-token" v-else-if="tokenIsValid">
                <transition name="error">
                    <error :message="error" v-if="error"/>
                </transition>

                <p>Please enter the information below to finish resetting your password.</p>

                <label>
                    <span>Email Address</span>
                    <input type="text" placeholder="Email Address" autocomplete="email" required v-model="email"/>
                </label>

                <input-with-confirm type="password" label="Password" autocomplete="off" placeholder="hunter2"
                                    v-model="password"/>

                <div class="buttons">
                    <loading v-if="loading"/>
                    <button type="submit" :disabled="submitDisabled">Reset</button>
                </div>
            </div>
            <loading v-else />
        </form>
    </div>
</template>

<script>
import InputWithConfirm from "@/components/InputWithConfirm"
import Loading from "@/components/Loading"
import Error from "@/components/Error"
import client from "@/client"

export default {
    name: "ResetPassword",
    components: {Error, Loading, InputWithConfirm},
    props: {
        token: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            email: '',
            password: {
                primary: '',
                confirm: '',
            },
            loading: false,
            error: null,
            tokenIsValid: null,
            passwordChanged: false,
        }
    },
    computed: {
        submitDisabled() {
            return this.loading || !this.password.primary || this.password.primary !== this.password.confirm || !this.email
        },
    },
    mounted() {
        this.loading = true
        client.checkResetPasswordToken(this.token)
            .then(() => this.tokenIsValid = true)
            .catch(() => this.tokenIsValid = false)
            .finally(() => this.loading = false)
    },
    methods: {
        submit() {
            this.error = null
            this.loading = true
            client.resetPassword(this.email, this.password.primary, this.token)
                .then(() => this.passwordChanged = true)
                .catch(err => this.error = err)
                .finally(() => this.loading = false)
        }
    }
}
</script>

<style lang="scss" scoped>
div.reset-password {
    form {
        & > div {
            width: 250px;
        }
    }
}
</style>