<template>
    <div class="bourre">
        <h3>Bourré</h3>
        <transition name="error">
            <error :message="error" v-if="error"/>
        </transition>

        <bourre-game-overview/>

        <bourre-players :players="players"/>

        <bourre-player-bar />
    </div>
</template>

<script>
    import {mapGetters} from "vuex"
    import BourrePlayers from "@/components/games/bourre/BourrePlayers.vue"
    import Error from "@/components/Error.vue"
    import BourreGameOverview from "@/components/games/bourre/BourreGameOverview.vue"
    import BourrePlayerBar from "@/components/games/bourre/BourrePlayerBar.vue"

    export default {
        name: "Bourre",
        components: {BourrePlayerBar, BourreGameOverview, Error, BourrePlayers},
        data() {
            return {
                error: null,
            }
        },
        computed: {
            ...mapGetters({
                gameState: 'bourre/gameState',
            }),
            trumpCard() {
                return this.gameState.trumpCard
            },
            players() {
                return this.gameState.players
            },
        },
        beforeUnmount() {
            this.$store.commit('clearGame')
        },
    }
</script>

<style lang="scss" scoped></style>