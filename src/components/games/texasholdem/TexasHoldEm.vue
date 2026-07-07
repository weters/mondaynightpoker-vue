<template>
  <div class="texas-hold-em">
    <h3>{{ replaceTokens(gameState.name) }}</h3>

    <poker-pots class="the-poker-pots" />

    <texas-hold-em-community class="the-community" />

    <texas-hold-em-participants
      class="the-participants"
      :participants="gameState.participants"
    />

    <poker-player-bar :selected-cards="selectedCards">
      <div :class="`hand hand-${numHoleCards}`">
        <template
          v-for="i in numHoleCards"
          :key="i"
        >
          <texas-hold-em-hole-card
            v-if="cards && cards.length >= i"
            :card="cards[i-1]"
            :selected="selected === i-1"
            @selected="updateSelected(i-1, $event)"
          />
        </template>
      </div>
    </poker-player-bar>
  </div>
</template>

<script>
import {mapState} from "pinia"
import {useTexasHoldEmStore} from "@/store/texasHoldEm"
import {usePokerStore} from "@/store/poker"
import TexasHoldEmCommunity from "@/components/games/texasholdem/TexasHoldEmCommunity.vue"
import TexasHoldEmParticipants from "@/components/games/texasholdem/TexasHoldEmParticipants.vue"
import PokerPlayerBar from "@/components/games/PokerPlayerBar.vue"
import PokerPots from "@/components/games/poker/PokerPots.vue"
import TexasHoldEmHoleCard from "@/components/games/texasholdem/TexasHoldEmHoleCard.vue"

export default {
    name: "TexasHoldEm",
    components: {
        TexasHoldEmHoleCard,
        PokerPots,
        PokerPlayerBar,
        TexasHoldEmParticipants,
        TexasHoldEmCommunity,
    },
    data() {
        return {
            confirm: null,
            hideButtons: false,
            selected: null,
        }
    },
    computed: {
        ...mapState(useTexasHoldEmStore, ['gameState', 'activeParticipant']),
        ...mapState(usePokerStore, ['actions', 'futureActions']),
        cards() {
            return this.activeParticipant && this.activeParticipant.cards
        },
        numHoleCards() {
            return this.gameState.variant.holeCards
        },
        selectedCards() {
            if (this.selected === null) {
                return
            }

            return [this.cards[this.selected]]
        },
        canDiscard() {
            const actions = this.actions || []
            const futureActions = this.futureActions || []

            return [
                ...actions,
                ...futureActions,
            ].findIndex(action => action.id === 'discard') >= 0
        }
    },
    watch: {
        canDiscard: {
            handler(canDiscard) {
                if (!canDiscard) {
                    this.selected = null
                }
            },
            immediate: true,
        }
    },
    methods: {
        updateSelected(card, isSelected) {
            if (!this.canDiscard) {
                return
            }

            if (!isSelected) {
                this.selected = null
                return
            }

            this.selected = card
        }
    }
}
</script>

<style lang="scss" scoped>
.texas-hold-em {
    .the-community {
        max-width: 500px;
        margin:    0 auto $spacing-medium;
    }

    .the-poker-pots {
        margin-bottom:   $spacing-medium;
        justify-content: center;
        flex-direction:  row;
    }

    .the-participants {
        margin-top: $spacing;
    }

    div.hand {
        display: flex;
        gap: 4px;

        & > * {
            @include player-bar-card-size;
        }
    }
}
</style>