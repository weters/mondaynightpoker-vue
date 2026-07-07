<template>
  <div class="guts">
    <h3>{{ gameName }}</h3>
    <transition name="error">
      <error-message
        v-if="error"
        :message="error"
      />
    </transition>

    <guts-game-overview />

    <guts-players :participants="participants" />

    <guts-player-bar />
  </div>
</template>

<script>
import {mapState, mapActions} from "pinia"
import {useRootStore} from "@/store"
import {useGutsStore} from "@/store/guts"
import GutsPlayers from "@/components/games/guts/GutsPlayers.vue"
import ErrorMessage from "@/components/ErrorMessage.vue"
import GutsGameOverview from "@/components/games/guts/GutsGameOverview.vue"
import GutsPlayerBar from "@/components/games/guts/GutsPlayerBar.vue"

export default {
    name: "Guts",
    components: {GutsPlayerBar, GutsGameOverview, ErrorMessage, GutsPlayers},
    data() {
        return {
            error: null,
        }
    },
    computed: {
        ...mapState(useGutsStore, ['gameState', 'cardCount', 'bloodyGuts', 'allowTrades']),
        participants() {
            return this.gameState.participants
        },
        gameName() {
            return `${this.cardCount}-Card ${this.bloodyGuts ? 'Bloody ' : ''}Guts${this.allowTrades ? ' with Trades' : ''}`
        },
    },
    beforeUnmount() {
        this.clearGame()
    },
    methods: {
        ...mapActions(useRootStore, ['clearGame']),
    },
}
</script>

<style lang="scss" scoped></style>
