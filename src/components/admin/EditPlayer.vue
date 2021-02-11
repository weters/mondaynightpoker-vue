<template>
    <div class="edit-player">
        <error v-if="error" :message="error" />

        <table class="standard">
            <tr>
                <th>ID</th>
                <td>{{ player.id }}</td>
            </tr>
            <tr>
                <th>Email</th>
                <td>{{ player.email }}</td>
            </tr>
            <tr>
                <th>Display Name</th>
                <td>{{ player.displayName }}</td>
            </tr>
            <tr>
                <th>Is Site Admin</th>
                <td>{{ player.isSiteAdmin }}</td>
            </tr>
            <tr>
                <th>Created</th>
                <td>{{ new Date(player.created).toLocaleString() }}</td>
            </tr>
            <tr>
                <th>Updated</th>
                <td>{{ new Date(player.updated).toLocaleString() }}</td>
            </tr>
            <tr>
                <th>Password</th>
                <td v-if="changePassword">
                    <form @submit.prevent="submitPassword">
                        <fancy-input label="Password" type="text" v-model="password" autocomplete="off" />
                        <div class="buttons">
                            <button type="button" class="secondary" @click="changePassword=false">Cancel</button>
                            <button type="submit">Change</button>
                        </div>
                    </form>
                </td>
                <td v-else><button type="button" @click="changePassword=true">Change Password</button></td>
            </tr>
        </table>

        <button type="button" class="secondary" @click="$emit('close')">Cancel</button>
    </div>
</template>

<script>
import client from "@/client"
import show_error from "@/mixins/show_error"
import Error from "@/components/Error"
import FancyInput from "@/components/FancyInput"

export default {
    name: "EditPlayer",
    components: {FancyInput, Error},
    mixins: [show_error],
    props: {
        player: {
            type: Object,
            required: true,
        }
    },
    data() {
        return {
            changePassword: false,
            error: false,
            loading: false,
            password: '',
        }
    },
    mounted() {
        this.scrollIntoView()
    },
    watch: {
        player() {
            this.scrollIntoView()
        }
    },
    methods: {
        scrollIntoView() {
            this.$el.scrollIntoView({ behavior: 'smooth' })
        },
        submitPassword() {
            if (this.password.length > 0) {
                this.loading = true
                client.changePassword(this.player.id, this.password)
                    .then(() => {
                        this.changePassword = false
                        this.password = ''
                    })
                    .catch(err => this.showError(err))
                .finally(() => this.loading = false)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../variables';

.edit-player {
    border: 1px solid $border-color;
    padding: $spacing;
    border-radius: $border-radius;
    margin-bottom: $spacing;

    table {
        th {
            border-width: 1px;
            text-align: left;
        }
    }
}
</style>