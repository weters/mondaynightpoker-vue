<template>
    <div class="verify-account small-content">
        <div>
            <h2>Verify Your Account</h2>

            <loading v-if="loading"/>

            <p v-if="success">Thank you. You're account has been verified. You may now
                <router-link to="/login">log in</router-link>
                <span>.</span></p>
            <p v-else>We could not verify your account. Please click the link found in your email.</p>
        </div>
    </div>
</template>

<script>
import client from "@/client"
import Loading from "@/components/Loading"

export default {
    name: "VerifyAccount",
    title: 'Verify Account',
    components: {Loading},
    props: {
        token: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            loading: true,
            success: null,
            error: null,
        }
    },
    mounted() {
        client.verifyAccount(this.token)
            .then(() => this.success = true)
            .catch(err => this.error = err)
            .finally(() => this.loading = false)
    },
}
</script>

<style lang="scss" scoped>
</style>