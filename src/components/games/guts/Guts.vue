<template>
    <div class="guts">
        <h3>{{ gameName }}</h3>
        <transition name="error">
            <error :message="error" v-if="error"/>
        </transition>

        <guts-game-overview/>

        <guts-players :participants="participants"/>

        <guts-player-bar/>
    </div>
</template>

<script>
import {mapGetters} from "vuex"
import GutsPlayers from "@/components/games/guts/GutsPlayers.vue"
import Error from "@/components/Error.vue"
import GutsGameOverview from "@/components/games/guts/GutsGameOverview.vue"
import GutsPlayerBar from "@/components/games/guts/GutsPlayerBar.vue"

export default {
    name: "Guts",
    components: {GutsPlayerBar, GutsGameOverview, Error, GutsPlayers},
    data() {
        return {
            error: null,
        }
    },
    computed: {
        ...mapGetters({
            gameState: 'guts/gameState',
            cardCount: 'guts/cardCount',
            bloodyGuts: 'guts/bloodyGuts',
            allowTrades: 'guts/allowTrades',
        }),
        participants() {
            return this.gameState.participants
        },
        gameName() {
            return `${this.cardCount}-Card ${this.bloodyGuts ? 'Bloody ' : ''}Guts${this.allowTrades ? ' with Trades' : ''}`
        },
    },
    beforeUnmount() {
        this.$store.commit('clearGame')
    },
}
</script>

<style lang="scss" scoped></style>
