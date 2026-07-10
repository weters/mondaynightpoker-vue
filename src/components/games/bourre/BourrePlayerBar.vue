<template>
  <player-bar
    :error="error"
    :is-turn="isTurn"
  >
    <template #cards>
      <template v-if="folded">
        <span class="folded-text">You folded</span>
      </template>
      <template v-else>
        <bourre-discard
          v-if="isTradeInRound"
          :hand="hand"
          @error="showError"
        />
        <bourre-hand
          v-else
          :hand="hand"
          @error="showError"
        />
      </template>
    </template>

    <template #gameInfo>
      <span class="round">
        <strong>Round:</strong>
        <span>{{ roundText }}</span>
      </span>
      <span class="turn">
        <strong>Turn:</strong>
        <span>{{ currentTurn }}</span>
      </span>
    </template>

    <template #settings>
      <p>Game balance: {{ formatAmount(gameData.balance) }}</p>
      <p>
        <label class="optional"><span>Sit out</span><input
          v-model="sitOut"
          type="checkbox"
          :disabled="sitOutLoading"
        ></label>
      </p>

      <template v-if="canRestart">
        <confirm-button
          label="Restart"
          confirm-text="Confirm Restart?"
          @confirmed="newBourreGame"
        />
      </template>
    </template>
  </player-bar>
</template>

<script>
import PlayerBar from "@/components/games/PlayerBar.vue"
import BourreHand from "@/components/games/bourre/BourreHand.vue"
import BourreDiscard from "@/components/games/bourre/BourreDiscard.vue"
import ConfirmButton from "@/components/ConfirmButton.vue"
import {mapActions, mapState} from "pinia"
import {useRootStore} from "@/store"
import {useBourreStore} from "@/store/bourre"
import balance from "@/mixins/balance"
import show_error from "@/mixins/show_error"

export default {
    name: "BourrePlayerBar",
    components: {ConfirmButton, PlayerBar, BourreDiscard, BourreHand},
    mixins: [balance, show_error],
    data() {
        return {
            error: null,
            sitOut: !useRootStore().userClientState.active,
            sitOutLoading: false,
        }
    },
    computed: {
        ...mapState(useBourreStore, ['isTradeInRound', 'hand', 'folded', 'isTurn', 'round', 'gameState', 'gameData']),
        ...mapState(useRootStore, ['canRestart', 'playerDataById']),
        roundText() {
            return this.round === 0 ? 'Play/Fold' : this.round
        },
        currentTurn() {
            if (!this.gameState.currentTurn) return
            return this.playerDataById(this.gameState.currentTurn).player.displayName
        },
    },
    watch: {
        sitOut(sitOut) {
            if (this.sitOutLoading) return
            this.sitOutLoading = true
            this.webSocketSend({action: 'playerStatus', additionalData: {active: !sitOut}})
                .catch(err => {
                    this.sitOut = !sitOut
                    this.showError(err)
                })
                .finally(() => this.sitOutLoading = false)
        },
    },
    methods: {
        ...mapActions(useRootStore, ['webSocketSend']),
        newBourreGame() {
            this.webSocketSend({action: 'createGame', subject: 'bourre', additionalData: {ante: this.gameState.ante}})
                .catch(err => this.showError(err))
        },
    },
}
</script>

<style lang="scss" scoped>
.folded-text {
    display:       inline-block;
    padding:       $space-1 $space-3;
    background:    rgba(#000, 0.25);
    border-radius: $radius-pill;
    color:         $on-felt-faint;
    font-style:    italic;
    font-size:     $fs-sm;
}
</style>
