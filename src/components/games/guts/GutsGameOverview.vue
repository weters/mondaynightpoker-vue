<template>
    <div class="guts-game-overview">
        <chip-stack :amount="pot"/>

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
                <span class="value">{{ formatAmount(ante) }}</span>
            </div>
            <div class="info-item">
                <span class="label">Max Owed</span>
                <span class="value">{{ formatAmount(maxOwed) }}</span>
            </div>
        </div>

        <div class="showdown-result" v-if="showdownResult">
            <template v-if="showdownResult.allFolded">
                <p class="all-folded">Everyone folded! Pot carries over to next round.</p>
            </template>
            <template v-else>
                <div class="deck-battle" v-if="showDeckBattle">
                    <p class="deck-label">The Deck</p>
                    <div :class="['deck-cards', `deck-cards-${deckCardsTotal}`]">
                        <playing-card-container
                            v-for="(card, index) in deckCardsForDisplay"
                            :key="'deck-' + index"
                            :card="card"
                        />
                    </div>
                    <p v-if="deckWon !== undefined" :class="['deck-outcome', deckWon ? 'deck-wins' : 'player-wins']">
                        {{ deckWon ? 'The deck wins!' : 'Player beats the deck!' }}
                    </p>
                </div>
                <p class="winners" v-if="showdownResult.winnerIds && showdownResult.winnerIds.length > 0">
                    <strong>Winner{{ showdownResult.winnerIds.length > 1 ? 's' : '' }}:</strong>
                    {{ winnerNames }}
                    <span class="pot-won">(won {{ formatAmount(showdownResult.potWon) }})</span>
                </p>
                <p class="losers" v-if="showdownResult.loserIds && showdownResult.loserIds.length > 0">
                    <strong>Loser{{ showdownResult.loserIds.length > 1 ? 's' : '' }}:</strong>
                    {{ loserNames }}
                    <span class="penalty">(paid {{ formatAmount(showdownResult.penaltyPaid) }} each)</span>
                </p>
                <p class="next-pot" v-if="showdownResult.nextPot > 0">
                    Next pot: {{ formatAmount(showdownResult.nextPot) }}
                </p>
            </template>
        </div>
    </div>
</template>

<script>
import {mapGetters} from "vuex"
import ChipStack from "@/components/ChipStack.vue"
import PlayingCardContainer from "@/components/PlayingCardContainer.vue"
import balance from "@/mixins/balance"

export default {
    name: "GutsGameOverview",
    components: {ChipStack, PlayingCardContainer},
    mixins: [balance],
    computed: {
        ...mapGetters({
            pot: 'guts/pot',
            round: 'guts/round',
            phase: 'guts/phase',
            ante: 'guts/ante',
            maxOwed: 'guts/maxOwed',
            showdownResult: 'guts/showdownResult',
            cardCount: 'guts/cardCount',
            deckHand: 'guts/deckHand',
            deckCardsRevealed: 'guts/deckCardsRevealed',
            deckCardsTotal: 'guts/deckCardsTotal',
            deckWon: 'guts/deckWon',
        }),
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
            const playerData = this.$store.getters.playerDataById(playerId)
            return playerData ? playerData.player.displayName : 'Unknown'
        },
    },
}
</script>

<style lang="scss" scoped>
@import '../../../variables.scss';

div.guts-game-overview {
    text-align: center;
    margin-bottom: $spacing;

    .chip-stack {
        margin: 0 auto;
    }

    .game-info {
        display: flex;
        justify-content: center;
        gap: $spacing;
        margin: $spacing-medium 0;
        flex-wrap: wrap;

        .info-item {
            background: $background-color;
            padding: $spacing-small $spacing-medium;
            border-radius: $border-radius;

            .label {
                font-size: 0.8em;
                color: $text-color-light;
                display: block;
            }

            .value {
                font-weight: bold;
            }
        }
    }

    .showdown-result {
        @include card;
        padding: $spacing;
        margin-top: $spacing-medium;
        text-align: center;

        .deck-battle {
            margin-bottom: $spacing-medium;
            padding-bottom: $spacing-medium;
            border-bottom: 1px solid $border-color;

            .deck-label {
                font-weight: bold;
                margin-bottom: $spacing-small;
                color: $text-color-light;
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
            }

            .deck-outcome {
                font-weight: bold;
                margin-top: $spacing-small;

                &.deck-wins {
                    color: $red;
                }

                &.player-wins {
                    color: $light-green;
                }
            }
        }

        p {
            margin: $spacing-small 0;

            &.all-folded {
                color: $text-color-light;
                font-style: italic;
            }

            &.winners {
                color: $light-green;
            }

            &.losers {
                color: $red;
            }

            .pot-won, .penalty {
                font-size: 0.9em;
                opacity: 0.8;
            }

            &.next-pot {
                font-weight: bold;
                margin-top: $spacing-medium;
            }
        }
    }
}
</style>
