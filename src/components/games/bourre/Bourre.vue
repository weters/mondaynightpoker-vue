<template>
    <div class="bourre">
        <h3>Bourr&eacute;</h3>
        <transition name="error">
            <error :message="error" v-if="error"/>
        </transition>

        <felt-table :participants="sortedPlayers">
            <template #center>
                <bourre-game-overview/>
            </template>

            <template #player="{ participant }">
                <bourre-player :player="participant" :player-data="playerDataById(participant.playerId)" />
            </template>
        </felt-table>

        <bourre-player-bar />
    </div>
</template>

<script>
    import {mapGetters} from "vuex"
    import BourrePlayer from "@/components/games/bourre/BourrePlayer.vue"
    import Error from "@/components/Error.vue"
    import BourreGameOverview from "@/components/games/bourre/BourreGameOverview.vue"
    import BourrePlayerBar from "@/components/games/bourre/BourrePlayerBar.vue"
    import FeltTable from "@/components/FeltTable.vue"

    export default {
        name: "Bourre",
        components: {FeltTable, BourrePlayerBar, BourreGameOverview, Error, BourrePlayer},
        data() {
            return {
                error: null,
            }
        },
        computed: {
            ...mapGetters({
                gameState: 'bourre/gameState',
                round: 'bourre/round',
            }),
            trumpCard() {
                return this.gameState.trumpCard
            },
            players() {
                return this.gameState.players
            },
            sortedPlayers() {
                if (this.round === 0) {
                    return this.players
                }

                const offset = ( this.round === 6 ? 4 : this.round - 1 ) % this.players.length
                const players = [...this.players]
                const tail = players.splice(offset)
                tail.push(...players)
                return tail
            },
        },
        methods: {
            playerDataById(id) {
                return this.$store.getters.playerDataById(id)
            },
        },
        beforeUnmount() {
            this.$store.commit('clearGame')
        },
    }
</script>

<style lang="scss" scoped></style>
