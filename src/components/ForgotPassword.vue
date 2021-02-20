<template>
    <div class="forgot-password small-content">
        <form @submit.prevent="submit">
            <h2>Reset your password</h2>

            <div v-if="success" class="success">
                <p>If you have an account, you will receive an email with further instructions to reset your password.
                    Thank you.</p>
            </div>
            <template v-else>
                <transition name="error">
                    <error :message="error" v-if="error"/>
                </transition>

                <p>Please supply your email address. We'll provide instructions for resetting your passsword to that address.</p>

                <fancy-input type="text" label="Email Address" autocomplete="email" required hide-required v-model="email" />

                <div class="buttons">
                    <loading v-if="loading" />
                    <button type="button" class="secondary" @click="cancel">Cancel</button>
                    <button type="submit" :disabled="submitDisabled">Reset</button>
                </div>
            </template>
        </form>
    </div>
</template>

<script>
import Error from "@/components/Error"
import Loading from "@/components/Loading"
import client from "@/client"
import FancyInput from "@/components/formelements/FancyInput"

export default {
    name: "ForgotPassword",
    title: 'Reset Password',
    components: {FancyInput, Loading, Error},
    data() {
        return {
            loading: false,
            error: null,
            email: '',
            success: false,
        }
    },
    computed: {
        submitDisabled() {
            return this.loading || !this.email
        },
    },
    methods: {
        cancel() {
            return this.$router.push('/login')
        },
        submit() {
            this.loading = true
            client.requestPasswordReset(this.email)
                .then(() => this.success = true)
                .catch(err => this.error = err)
                .finally(() => this.loading = false)
        },
    },
}
</script>

<style lang="scss" scoped>
div.forgot-password {
    div.buttons {
        position: relative;
        .loading {
            position: absolute;
            bottom: 0;
            right: 0;
        }
    }
}
</style>