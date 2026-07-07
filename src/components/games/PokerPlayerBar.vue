<template>
  <player-bar
    :error="error"
    :is-turn="isTurn"
  >
    <template #cards>
      <slot />
    </template>

    <template #actions>
      <poker-actions
        :actions="actions"
        :future-actions="futureActions"
        :selected-cards="selectedCards"
        :self="self"
        :poker-state="pokerState"
        :game-state="gameState"
        @error="showError"
      />
    </template>

    <template #gameInfo>
      {{ self.handRank }}
    </template>
  </player-bar>
</template>

<script>
import PlayerBar from "./PlayerBar.vue"
import PokerActions from "./poker/PokerActions.vue"
import {mapState} from "pinia"
import {usePokerStore} from "@/store/poker"
import show_error from "@/mixins/show_error"

export default {
    name: "PokerPlayerBar",
    components: {PlayerBar, PokerActions},
    mixins: [show_error],
    props: {
        selectedCards: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            error: null,
        }
    },
    computed: {
        ...mapState(usePokerStore, ['self', 'gameState', 'pokerState', 'actions', 'futureActions']),
        isTurn() {
            return this.gameState.currentTurn === this.self.playerId || this.gameState.action === this.self.playerId
        },
    },
}
</script>
