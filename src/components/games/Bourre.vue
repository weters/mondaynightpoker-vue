<template>
    <div class="bourre">
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
    import BourrePlayers from "@/components/games/BourrePlayers"
    import Error from "@/components/Error"
    import BourreGameOverview from "@/components/games/BourreGameOverview"
    import BourrePlayerBar from "@/components/games/BourrePlayerBar"

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
        beforeDestroy() {
            this.$store.commit('clearGame')
        },
    }
</script>

<style lang="scss" scoped></style>