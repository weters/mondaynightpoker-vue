<template>
    <div class="forgot-password">
        <form @submit.prevent="submit" class="min hide-required">
            <h2>Reset Your Password</h2>

            <div v-if="success" class="success">
                <p>If you have an account, you will receive an email with further instructions to reset your password.
                    Thank you.</p>
            </div>
            <template v-else>
                <transition name="error">
                    <error :message="error" v-if="error"/>
                </transition>

                <label>
                    <span>Email Address</span>
                    <input type="text" placeholder="Email Address" autocomplete="email" required v-model="email"/>
                </label>

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

export default {
    name: "ForgotPassword",
    components: {Loading, Error},
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

    div.success {
        width: 250px;
    }
}
</style>