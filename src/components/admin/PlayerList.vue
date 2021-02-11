<template>
    <div class="player-list">
        <h3>Player List</h3>

        <error :message="error" v-if="error"/>

        <edit-player :player=editPlayer v-if="editPlayer" @close="editPlayer=null" />

        <loading class="pl-loading" v-if="loading"/>

        <form @submit.prevent="" class="search">
            <fancy-input type="text" label="Player Search" v-model="search" autocomplete="off" />
        </form>

        <table class="standard">
            <thead>
            <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Display Name</th>
                <th>Joined</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="player in players" :key="player.id">
                <td>{{ player.id }}</td>
                <td>{{ player.email }}</td>
                <td>{{ player.displayName }}</td>
                <td>{{ new Date(player.created).toLocaleString() }}</td>
                <td><button type="button" @click="editPlayer=player">Edit</button></td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import client from "../../client"
    import Error from "../Error"
    import Loading from "../Loading"
    import EditPlayer from "@/components/admin/EditPlayer"
    import FancyInput from "@/components/FancyInput"

    export default {
        name: "PlayerList",
        components: {FancyInput, EditPlayer, Loading, Error},
        data() {
            return {
                loading: false,
                error: false,
                players: null,
                search: '',
                editPlayer: null,
            }
        },
        mounted() {
            this.fetchPlayers()
        },
        methods: {
            fetchPlayers() {
                this.loading = true
                client.getPlayers(this.search)
                    .then(res => this.players = res)
                    .catch(err => this.error = err)
                    .finally(() => this.loading = false)
            }
        },
        watch: {
            search() {
                this.fetchPlayers()
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../variables';
    @media (max-width: #{$media-small-table-width}) {
        table.standard td:nth-child(1)::before { content: 'ID' }
        table.standard td:nth-child(2)::before { content: 'Email' }
        table.standard td:nth-child(3)::before { content: 'Display Name' }
        table.standard td:nth-child(4)::before { content: 'Joined' }
    }

    div.player-list {
        .pl-loading {
            position: absolute;
        }

        form.search {
            border-width: 0;
            padding: 0;
            width: auto;
        }
    }
</style>