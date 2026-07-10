<template>
  <div class="little-l">
    <h3>{{ gameState.name }}</h3>

    <div class="board">
      <little-l-community />

      <poker-pots />
    </div>

    <little-l-participants />

    <poker-player-bar :selected-cards="selectedCards">
      <little-l-hand
        v-model="selectedCards"
        :can-select="gameState.round === 0"
        class="bar-hand"
      />
    </poker-player-bar>
  </div>
</template>

<script>
import LittleLCommunity from "./LittleLCommunity.vue"
import {mapState} from "pinia"
import {useRootStore} from "@/store"
import {usePokerStore} from "@/store/poker"
import LittleLHand from "./LittleLHand.vue"
import balance from "../../../mixins/balance"
import show_error from "../../../mixins/show_error"
import LittleLParticipants from "./LittleLParticipants.vue"
import PokerPlayerBar from "../PokerPlayerBar.vue"
import PokerPots from "@/components/games/poker/PokerPots.vue"

export default {
    name: "LittleL",
    components: {PokerPots, PokerPlayerBar, LittleLParticipants, LittleLHand, LittleLCommunity},
    mixins: [balance, show_error],
    data() {
        return {
            selectedCards: [],
            confirm: null,
            bet: null,
            startingBet: 0,
            amount: 0,
        }
    },
    computed: {
        ...mapState(useRootStore, ['game']),
        ...mapState(usePokerStore, ['gameState', 'pokerState']),
        tradeIns() {
            const tradeIns = Object.keys(this.gameState.tradeIns)
            tradeIns.sort()


            const firstPart = tradeIns.slice(0, -1).join(', ')
            return `${firstPart} or ${tradeIns[tradeIns.length - 1]}`
        },
    },
}
</script>

<style lang="scss" scoped>
.little-l {
    h3 {
        text-align: center;
        color: $gold-soft;
        border-bottom: 1px solid $felt-hairline;
        font-weight: $fw-semibold;
        letter-spacing: $tracking-tight;
    }
}

div.board {
    display:       flex;
    margin-bottom: $spacing;
    align-items:   flex-end;
    padding:       $space-3 $space-4;
    background:    $felt-surface;
    border:        1px solid $felt-hairline;
    border-radius: $radius-lg;
    box-shadow:    inset 0 0 90px rgba(#000, 0.35), $shadow-felt-sm;
    color:         $on-felt;

    & > :first-child {
        flex: 1 0 100px;
    }

    & > :nth-child(2) {
        margin-left: $spacing;
    }

    :deep(.amount) {
        font-size: $fs-lg;
        color: $gold-soft;
        text-shadow: 0 0 12px rgba($gold, 0.4);
    }

    @media (max-width: #{$mobile-max}) {
        align-items: flex-start;
    }
}
</style>