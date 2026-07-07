<template>
  <div class="bourre">
    <h3>Bourré</h3>
    <transition name="error">
      <error-message
        v-if="error"
        :message="error"
      />
    </transition>

    <bourre-game-overview />

    <bourre-players :players="players" />

    <bourre-player-bar />
  </div>
</template>

<script>
    import {mapState, mapActions} from "pinia"
    import {useRootStore} from "@/store"
    import {useBourreStore} from "@/store/bourre"
    import BourrePlayers from "@/components/games/bourre/BourrePlayers.vue"
    import ErrorMessage from "@/components/ErrorMessage.vue"
    import BourreGameOverview from "@/components/games/bourre/BourreGameOverview.vue"
    import BourrePlayerBar from "@/components/games/bourre/BourrePlayerBar.vue"

    export default {
        name: "Bourre",
        components: {BourrePlayerBar, BourreGameOverview, ErrorMessage, BourrePlayers},
        data() {
            return {
                error: null,
            }
        },
        computed: {
            ...mapState(useBourreStore, ['gameState']),
            trumpCard() {
                return this.gameState.trumpCard
            },
            players() {
                return this.gameState.players
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