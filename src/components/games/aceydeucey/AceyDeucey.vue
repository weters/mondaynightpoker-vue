<template>
  <div class="acey-deucey">
    <h3>{{ gameState.name }}</h3>

    <acey-deucey-round :round="round" />

    <acey-deucey-player-list :participants="gameState.participants" />

    <player-bar
      :error="error"
      :is-turn="isTurn"
    >
      <template #actions>
        <div class="acey-deucey-actions">
          <poker-bet-chips
            v-if="showBet"
            :min-bet="25"
            :max-bet="maxBet"
            :all-in-amount="maxBet"
            all-in-label="Max bet"
            action-name="Bet"
            @submit="executeBet"
            @cancel="showBet = false"
          />
          <div
            v-else
            class="buttons"
          >
            <confirm-button
              v-for="action in actions"
              :key="action.id"
              :label="action.name"
              :confirm-text="`Confirm ${action.name}?`"
              :skip-confirm="action.id === 'bet'"
              @confirmed="handleAction(action)"
            />
          </div>
        </div>
      </template>
    </player-bar>
  </div>
</template>

<script>
import PlayerBar from "@/components/games/PlayerBar.vue"
import AceyDeuceyRound from "@/components/games/aceydeucey/AceyDeuceyRound.vue"
import PokerBetChips from "@/components/games/poker/PokerBetChips.vue"
import ConfirmButton from "@/components/ConfirmButton.vue"
import {mapActions, mapState} from "pinia"
import {useRootStore} from "@/store"
import {useAceyDeuceyStore} from "@/store/aceyDeucey"
import show_error from "@/mixins/show_error"
import AceyDeuceyPlayerList from "@/components/games/aceydeucey/AceyDeuceyPlayerList.vue"

export default {
    name: "AceyDeucey",
    components: {ConfirmButton, PokerBetChips, AceyDeuceyPlayerList, AceyDeuceyRound, PlayerBar},
    mixins: [show_error],
    data() {
        return {
            error: null,
            showBet: false,
        }
    },
    computed: {
        ...mapState(useRootStore, ['game', 'user']),
        ...mapState(useAceyDeuceyStore, ['gameState', 'actions']),
        isTurn() {
            return this.gameState.currentTurn === this.user.player.id
        },
        round() {
            return this.gameState.round
        },
        maxBet() {
            return this.gameState.maxBet
        },
    },
    watch: {
        actions() {
            this.showBet = false
        },
    },
    methods: {
        ...mapActions(useRootStore, ['webSocketSend']),
        handleAction(action) {
            if (action.id === 'bet') {
                this.showBet = true
                return
            }
            this.webSocketSend({action: action.id})
                .catch(err => this.showError(err))
        },
        executeBet(amount) {
            const betAction = this.actions.find(a => a.id === 'bet')
            if (!betAction) return
            this.webSocketSend({action: betAction.id, additionalData: {amount}})
                .catch(err => this.showError(err))
        },
    },
}
</script>

<style lang="scss" scoped>
div.acey-deucey {
    .acey-deucey-actions {
        padding: $spacing-medium 0;

        .buttons {
            display:         flex;
            align-items:     center;
            justify-content: center;
            gap:             $spacing-medium;
            margin:          0;
            flex-wrap:       wrap;
        }
    }
}
</style>
