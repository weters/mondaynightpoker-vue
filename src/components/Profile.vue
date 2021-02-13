<template>
    <div class="profile small-content">
        <div>
            <h2>Manage my profile</h2>

            <form @submit.prevent="saveDisplayName" class="inner">
                <h3>Display Name</h3>

                <transition name="error">
                    <error :message="error" v-if="error"/>
                </transition>

                <div class="success" v-if="success">
                    <p>Your changes have been saved successfully.</p>
                </div>

                <p>Your display name is how other users will see you online. Only your display name is visible. It does
                    not
                    need to be unique.</p>

                <fancy-input type="text" label="Display Name" v-model="displayName" required :disabled="loading"/>

                <div class="buttons">
                    <button :disabled="loading">Save Changes</button>
                </div>
            </form>

            <loading v-if="loading"/>

            <h3>Danger Zone</h3>

            <h4>Delete Your Account*</h4>

            <p>Deleting your account is irreversible. You may create a new account in the future, but all your current
                information will be lost.</p>

            <form @submit.prevent="deleteAccount" v-if="confirmDelete">
                <p class="confirm">Are you sure you want to delete your account? Type your email address to confirm.</p>
                <fancy-input label="Email" type="text" autocomplete="off" required
                             v-model="deleteConfirmEmail"/>

                <div class="buttons">
                    <button type="button" class="secondary" @click="confirmDelete = false; deleteConfirmEmail = ''">
                        Cancel
                    </button>
                    <button type="button" class="destructive" :disabled="!canDeleteAccount">Delete Your Account</button>
                </div>
            </form>
            <div class="delete-your-account" v-else>
                <button type="button" class="destructive" @click="confirmDelete=true">Delete Your Account</button>
            </div>

            <p class="note">*In order to keep table balances consistent, we maintain the user record but replace your
                email, display name, and password with a random string.</p>
        </div>
    </div>
</template>

<script>
import client from "../client"
import Loading from "./Loading"
import Error from "./Error"
import FancyInput from "@/components/FancyInput"

export default {
    name: "Profile",
    title: 'My Profile',
    components: {FancyInput, Error, Loading},
    data() {
        return {
            displayName: this.$store.state.user.player.displayName,
            loading: false,
            error: null,
            success: false,

            confirmDelete: false,
            deleteConfirmEmail: '',
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
        deleteAccount() {
            client.deleteAccount(this.$store.state.user.player.id)
                .then(() => {
                    this.$store.dispatch('notification', 'Your account has been deleted')
                    this.$router.push('/login')
                })
                .catch(err => this.$store.dispatch('error', err))
        },
    },
    computed: {
        canDeleteAccount() {
            return this.$store.state.user.player.email === this.deleteConfirmEmail
        },
    },
}
</script>

<style lang="scss" scoped>
@import '../variables.scss';

div.success {
    color: $primary;
}

p.confirm {
    color: $red;
}

div.delete-your-account {
    margin-bottom: $spacing;
}

div.buttons {
    margin-bottom: $spacing;
}
</style>