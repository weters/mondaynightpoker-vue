<template>
  <div :class="{ 'little-l-participant': true, 'is-action': isAction, 'is-folded': participant.didFold }">
    <div class="cards">
      <div
        v-for="(card, cardIndex) in cards"
        :key="cardIndex"
      >
        <playing-card-container
          :card="card"
          :hide-card="participant.didFold || hideCard(cardIndex)"
        />
      </div>
    </div>

    <div :class="{ metadata: true, 'disconnected': !playerData.isConnected }">
      <div class="participant">
        <div class="name-hand">
          <strong class="display-name">{{ playerData.player.displayName }}</strong>
          <span
            v-if="participant.didFold"
            class="folded-chip"
          >Folded</span>
          <span
            v-else-if="participant.handRank"
            :class="{'hand-rank': true, 'is-winner': isWinner}"
          >{{ participant.handRank }}</span>
        </div>
        <div class="chips">
          {{ formatAmount(participant.balance) }}
        </div>
      </div>
      <div class="bet">
        <chip-stack
          :amount="chipStack"
          class="metadata-chip-stack"
        />
      </div>
    </div>
  </div>
</template>

<script>
    import PlayingCardContainer from "../../PlayingCardContainer.vue"
    import {mapState} from "pinia"
    import {useRootStore} from "@/store"
    import {usePokerStore} from "@/store/poker"
    import balance from "../../../mixins/balance"
    import ChipStack from "../../ChipStack.vue"
    import {formatAmount} from "@/currency"

    export default {
        name: "LittleLParticipant",
        components: {ChipStack, PlayingCardContainer},
        mixins: [balance],
        props: {
            participant: {
                type: Object,
                required: true,
            },
        },
        data() {
            return {
                i: 0,
                hiddenCards: 0, // cards to hide for a short-time for visual indication of trade-in
            }
        },
        computed: {
            ...mapState(usePokerStore, ['gameState']),
            ...mapState(useRootStore, ['playerDataById']),
            isAction() {
                return this.participant.playerId === this.gameState.action
            },
            playerData() {
                return this.playerDataById(this.participant.playerId)
            },
            cards() {
                if (!this.participant.hand || this.participant.didFold) {
                    const hand = []
                    for (let i = 0; i < this.gameState.initialDeal; i++) {
                        hand.push(null)
                    }

                    return hand
                }

                return this.participant.hand
            },
            isWinner() {
                return this.gameState.winners && Object.prototype.hasOwnProperty.call(this.gameState.winners, this.participant.playerId)
            },
            chipStack() {
                if (this.gameState.winners) {
                    return this.gameState.winners[this.participant.playerId] || 0
                }

                return this.participant.currentBet
            }
        },
        watch: {
            'participant.traded': {
                handler(newVal) {
                    this.hiddenCards = newVal
                    setTimeout(() => {
                        this.hiddenCards = 0
                    }, 500)
                }
            }
        },
        methods: {
            formatAmount,
            hideCard(index) {
                return index >= this.cards.length - this.hiddenCards
            }
        }
    }
</script>

<style lang="scss" scoped>
    $max-width: 599px;

    div.little-l-participant {
        background:    $felt-rail;
        border:        1px solid $felt-hairline;
        border-radius: $radius-md;
        box-shadow:    $shadow-felt-md;
        color:         $on-felt;
        padding:       $spacing-medium;
        transition:    box-shadow $dur-normal $ease-standard;

        // Current turn — the single most important glance state.
        &.is-action {
            @include current-turn;
            box-shadow: $shadow-felt-md, $glow-turn;
        }

        &.is-folded {
            opacity: 0.5;
            filter: grayscale(0.4);
        }

        @media (prefers-reduced-motion: reduce) {
            transition: box-shadow $dur-fast linear;
        }

        div.cards {
            display: flex;
            margin:  -2px;

            & > * {
                flex:   1 1 100px;
                margin: 2px;
            }

            @media (max-width: $max-width) {
                margin: -1px;
                & > * {
                    margin: 1px;
                }
            }
        }

        div.metadata {
            margin-top: $spacing-small;
            display: grid;
            grid-template-columns: 2fr 1fr;

            strong.display-name {
                font-weight: $fw-semibold;
            }

            &.disconnected {
                strong.display-name {
                    font-weight: $fw-regular;
                    font-style: italic;
                    color: $on-felt-faint;
                }
            }

            .participant {
                .chips {
                    @include numeric;
                    color: $on-felt-muted;
                    font-size: $fs-sm;
                }

                .name-hand {
                    .hand-rank {
                        display:     block;
                        font-size:   $fs-md;
                        color: $on-felt-muted;

                        &.is-winner {
                            font-weight: $fw-bold;
                            color: $gold-soft;
                            text-shadow: 0 0 10px rgba($gold, 0.35);
                        }
                    }

                    .folded-chip {
                        display:        block;
                        font-size:      $fs-2xs;
                        font-weight:    $fw-bold;
                        text-transform: uppercase;
                        letter-spacing: $tracking-wide;
                        color:          $on-felt-faint;
                    }
                }
            }

            .bet {
                margin-left: auto;
            }
        }
    }
</style>