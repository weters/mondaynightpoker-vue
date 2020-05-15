<template>
    <div class="profile main-box">
        <h2>Manage My Profile</h2>

        <form @submit.prevent="saveDisplayName">
            <h3>Display Name</h3>

            <transition name="error">
                <error :message="error" v-if="error"/>
            </transition>

            <div class="success" v-if="success">
                <p>Your changes have been saved successfully.</p>
            </div>

            <p>Your display name is how other users will see you online. Only your display name is visible. It does not
                need to be unique.</p>
            <label>
                <span>Display Name</span>
                <input type="text" v-model="displayName" placeholder="Timmy Two Times" required :disabled="loading"/>
            </label>

            <div class="buttons">
                <button :disabled="loading">Save Changes</button>
            </div>

            <loading v-if="loading"/>
        </form>
    </div>
</template>

<script>
    import client from "../client"
    import Loading from "./Loading"
    import Error from "./Error"

    export default {
        name: "Profile",
        components: {Error, Loading},
        data() {
            return {
                displayName: this.$store.state.user.player.displayName,
                loading: false,
                error: null,
                success: false,
            }
        },
        methods: {
            saveDisplayName() {
                this.error = null
                client.updatePlayer(this.$store.state.user.player.id, {
                        displayName: this.displayName,
                    })
                    .then(() => {
                        this.success = true

                        client.validateJWT(this.$store.state.user.jwt)
                            .then(player => this.$store.commit('setUserPlayer', player))
                            .catch(err => this.error = err)
                    })
                    .catch(err => this.error = err)
                    .finally(() => this.loading = false)
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import '../variables.scss';

    div.success {
        color: $primary;
    }
</style>