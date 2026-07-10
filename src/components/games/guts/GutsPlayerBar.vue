<template>
  <player-bar
    :error="error"
    :is-turn="canDecide || canTrade"
  >
    <template #cards>
      <template v-if="isGameOver">
        <p class="game-over-message">
          Game Over!
        </p>
      </template>
      <template v-else>
        <guts-hand
          v-model="selectedCards"
          :hand="hand"
          :card-count="cardCount"
          :hidden-cards="hiddenCards"
          :can-select="canSelectCards"
          :folded="isTradePhase && myDecision === false"
        />
      </template>
    </template>

    <template #actions>
      <template v-if="!isGameOver">
        <guts-decision
          v-if="isDeclarationPhase"
          @error="showError"
        />
        <guts-trade
          v-if="isTradePhase && myDecision"
          :selected-cards="selectedCards"
          @error="showError"
          @clear-selection="clearSelection"
        />
        <div
          v-if="isTradePhase && myDecision === false"
          class="folded-message"
        >
          <p>You folded this round</p>
        </div>
      </template>
    </template>

    <template #gameInfo>
      {{ handRank }}
    </template>
  </player-bar>
</template>

<script>
import PlayerBar from "@/components/games/PlayerBar.vue"
import GutsHand from "@/components/games/guts/GutsHand.vue"
import GutsDecision from "@/components/games/guts/GutsDecision.vue"
import GutsTrade from "@/components/games/guts/GutsTrade.vue"
import {mapState} from "pinia"
import {useGutsStore} from "@/store/guts"

export default {
    name: "GutsPlayerBar",
    components: {PlayerBar, GutsDecision, GutsHand, GutsTrade},
    data() {
        return {
            error: null,
            hiddenCards: 0,
            selectedCards: [],
        }
    },
    computed: {
        ...mapState(useGutsStore, [
            'hand',
            'handRank',
            'isDeclarationPhase',
            'isTradePhase',
            'isGameOver',
            'canDecide',
            'canTrade',
            'cardCount',
            'myTraded',
            'hasTraded',
            'myDecision',
        ]),
        canSelectCards() {
            return this.isTradePhase && !this.hasTraded
        },
    },
    watch: {
        myTraded(newVal) {
            if (newVal > 0) {
                this.hiddenCards = newVal
                setTimeout(() => {
                    this.hiddenCards = 0
                }, 500)
            }
        },
        isTradePhase(newVal) {
            if (!newVal) {
                this.selectedCards = []
            }
        },
    },
    methods: {
        showError(err) {
            this.error = err
            setTimeout(() => this.error = null, 2000)
        },
        clearSelection() {
            this.selectedCards = []
        },
    },
}
</script>

<style lang="scss" scoped>
.game-over-message {
    text-align: center;
    font-size: $fs-md;
    font-weight: $fw-bold;
    letter-spacing: $tracking-tight;
    color: $gold-soft;
    margin: 0;
}

.folded-message {
    text-align: center;

    p {
        color: $on-felt-muted;
        font-style: italic;
        margin: 0;
    }
}
</style>
