<template>
  <div class="guts-game-overview">
    <chip-stack :amount="pot" />

    <div class="game-info">
      <div class="info-item">
        <span class="label">Round</span>
        <span class="value">{{ round }}</span>
      </div>
      <div class="info-item">
        <span class="label">Phase</span>
        <span class="value">{{ phaseDisplay }}</span>
      </div>
      <div class="info-item">
        <span class="label">Ante</span>
        <span class="value value--money">{{ formatAmount(ante) }}</span>
      </div>
      <div class="info-item">
        <span class="label">Max Owed</span>
        <span class="value value--money">{{ formatAmount(maxOwed) }}</span>
      </div>
      <div
        v-if="overflowPot > 0"
        class="info-item"
      >
        <span class="label">Overflow</span>
        <span class="value value--money">{{ formatAmount(overflowPot) }}</span>
      </div>
    </div>

    <div
      v-if="showdownResult"
      class="showdown-result"
    >
      <template v-if="showdownResult.allFolded">
        <p class="all-folded">
          Everyone folded! Pot carries over to next round.
        </p>
      </template>
      <template v-else>
        <div
          v-if="showDeckBattle"
          class="deck-battle"
        >
          <p class="deck-label">
            The Deck
          </p>
          <div :class="['deck-cards', `deck-cards-${deckCardsTotal}`]">
            <playing-card-container
              v-for="(card, index) in deckCardsForDisplay"
              :key="'deck-' + index"
              :card="card"
            />
          </div>
          <p
            v-if="deckWon !== undefined"
            :class="['deck-outcome', deckWon ? 'deck-wins' : 'player-wins']"
          >
            {{ deckWon ? 'The deck wins!' : 'Player beats the deck!' }}
          </p>
        </div>
        <p
          v-if="showdownResult.winnerIds && showdownResult.winnerIds.length > 0"
          class="winners"
        >
          <strong>Winner{{ showdownResult.winnerIds.length > 1 ? 's' : '' }}:</strong>
          {{ winnerNames }}
          <span class="pot-won">(won {{ formatAmount(showdownResult.potWon) }})</span>
        </p>
        <p
          v-if="showdownResult.loserIds && showdownResult.loserIds.length > 0"
          class="losers"
        >
          <strong>Loser{{ showdownResult.loserIds.length > 1 ? 's' : '' }}:</strong>
          {{ loserNames }}
          <span class="penalty">(paid {{ formatAmount(showdownResult.penaltyPaid) }} each)</span>
        </p>
        <p
          v-if="showdownResult.nextPot > 0"
          class="next-pot"
        >
          Next pot: {{ formatAmount(showdownResult.nextPot) }}
        </p>
      </template>
    </div>
  </div>
</template>

<script>
import {mapState} from "pinia"
import {useRootStore} from "@/store"
import {useGutsStore} from "@/store/guts"
import ChipStack from "@/components/ChipStack.vue"
import PlayingCardContainer from "@/components/PlayingCardContainer.vue"
import balance from "@/mixins/balance"

export default {
    name: "GutsGameOverview",
    components: {ChipStack, PlayingCardContainer},
    mixins: [balance],
    computed: {
        ...mapState(useGutsStore, [
            'pot',
            'overflowPot',
            'round',
            'phase',
            'ante',
            'maxOwed',
            'showdownResult',
            'cardCount',
            'deckHand',
            'deckCardsRevealed',
            'deckCardsTotal',
            'deckWon',
        ]),
        ...mapState(useRootStore, ['playerDataById']),
        showDeckBattle() {
            return this.deckCardsTotal > 0
        },
        deckCardsForDisplay() {
            const cards = []
            for (let i = 0; i < this.deckCardsTotal; i++) {
                if (i < this.deckCardsRevealed && this.deckHand) {
                    cards.push(this.deckHand[i])
                } else {
                    cards.push(null) // Shows card back
                }
            }
            return cards
        },
        phaseDisplay() {
            const phases = {
                'dealing': 'Dealing',
                'declaration': 'Declaration',
                'tradeIn': 'Trade',
                'showdown': 'Showdown',
                'roundEnd': 'Round Over',
                'gameOver': 'Game Over',
            }
            return phases[this.phase] || this.phase
        },
        winnerNames() {
            if (!this.showdownResult || !this.showdownResult.winnerIds) return ''
            return this.showdownResult.winnerIds.map(id => this.getPlayerName(id)).join(', ')
        },
        loserNames() {
            if (!this.showdownResult || !this.showdownResult.loserIds) return ''
            return this.showdownResult.loserIds.map(id => this.getPlayerName(id)).join(', ')
        },
    },
    methods: {
        getPlayerName(playerId) {
            const playerData = this.playerDataById(playerId)
            return playerData ? playerData.player.displayName : 'Unknown'
        },
    },
}
</script>

<style lang="scss" scoped>
div.guts-game-overview {
    text-align: center;
    margin-bottom: $spacing;
    color: $on-felt;

    .chip-stack {
        margin: 0 auto;
    }

    .game-info {
        display: flex;
        justify-content: center;
        gap: $space-3;
        margin: $spacing-medium 0;
        flex-wrap: wrap;

        .info-item {
            background: rgba(#000, 0.18);
            border: 1px solid $felt-hairline;
            padding: $space-2 $spacing-medium;
            border-radius: $radius-md;

            .label {
                font-size: $fs-2xs;
                text-transform: uppercase;
                letter-spacing: $tracking-caps;
                color: $on-felt-muted;
                display: block;
            }

            .value {
                font-weight: $fw-bold;
                color: $on-felt;

                &.value--money {
                    @include numeric;
                }
            }
        }
    }

    .showdown-result {
        background: $felt-rail;
        border: 1px solid $felt-hairline;
        border-radius: $radius-md;
        box-shadow: $shadow-felt-md;
        color: $on-felt;
        padding: $spacing;
        margin-top: $spacing-medium;
        text-align: center;

        .deck-battle {
            margin-bottom: $spacing-medium;
            padding-bottom: $spacing-medium;
            border-bottom: 1px solid $felt-hairline;

            .deck-label {
                font-weight: $fw-semibold;
                text-transform: uppercase;
                letter-spacing: $tracking-wide;
                font-size: $fs-xs;
                margin-bottom: $spacing-small;
                color: $on-felt-muted;
            }

            .deck-cards {
                display: grid;
                grid-template-columns: repeat(2, minmax(50px, 100px));
                grid-gap: $spacing-medium;
                justify-content: center;
                margin: $spacing-small auto;
                max-width: fit-content;

                &.deck-cards-3 {
                    grid-template-columns: repeat(3, minmax(50px, 100px));
                }

                &.deck-cards-4 {
                    grid-template-columns: repeat(4, minmax(50px, 100px));
                }
            }

            .deck-outcome {
                font-weight: $fw-bold;
                margin-top: $spacing-small;

                &.deck-wins {
                    color: $negative;
                }

                &.player-wins {
                    color: $positive;
                }
            }
        }

        p {
            margin: $spacing-small 0;

            &.all-folded {
                color: $on-felt-muted;
                font-style: italic;
            }

            &.winners {
                color: $positive;
                font-weight: $fw-semibold;
            }

            &.losers {
                color: $negative;
                font-weight: $fw-semibold;
            }

            .pot-won, .penalty {
                @include numeric;
                font-size: 0.9em;
                opacity: 0.8;
            }

            &.next-pot {
                @include numeric;
                font-weight: $fw-bold;
                color: $gold-soft;
                margin-top: $spacing-medium;
            }
        }
    }
}
</style>
