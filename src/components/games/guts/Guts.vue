<template>
    <div class="guts">
        <h3>{{ gameName }}</h3>
        <transition name="error">
            <error :message="error" v-if="error"/>
        </transition>

        <felt-table :participants="participants">
            <template #center>
                <guts-game-overview/>
            </template>

            <template #player="{ participant }">
                <guts-player :participant="participant" :player-data="playerDataById(participant.playerId)" />
            </template>
        </felt-table>

        <guts-player-bar/>
    </div>
</template>

<script>
import {mapGetters} from "vuex"
import GutsPlayer from "@/components/games/guts/GutsPlayer.vue"
import Error from "@/components/Error.vue"
import GutsGameOverview from "@/components/games/guts/GutsGameOverview.vue"
import GutsPlayerBar from "@/components/games/guts/GutsPlayerBar.vue"
import FeltTable from "@/components/FeltTable.vue"

export default {
    name: "Guts",
    components: {FeltTable, GutsPlayerBar, GutsGameOverview, Error, GutsPlayer},
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
