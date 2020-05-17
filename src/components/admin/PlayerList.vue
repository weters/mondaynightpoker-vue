<template>
    <div class="player-list">
        <h3>Player List</h3>

        <error :message="error" v-if="error" />
        <loading v-if="loading" />

        <table class="standard">
            <thead>
            <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Display Name</th>
                <th>Joined</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="player in players" :key="player.id">
                <td>{{ player.id }}</td>
                <td>{{ player.email }}</td>
                <td>{{ player.displayName }}</td>
                <td>{{ new Date(player.created).toLocaleString() }}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import client from "../../client"
    import Error from "../Error"
    import Loading from "../Loading"

    export default {
        name: "PlayerList",
        components: {Loading, Error},
        data() {
            return {
                loading: false,
                error: false,
                players: null,
            }
        },
        mounted() {
            this.loading = true
            client.getPlayers()
                .then(res => this.players = res)
                .catch(err => this.error = err)
                .finally(() => this.loading = false)
        },
    }
</script>

<style lang="scss" scoped>

</style>