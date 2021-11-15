<template>
    <div :class="{ 'little-l-participant': true, 'is-action': isAction }">
        <div class="cards">
            <div v-for="(card, i) in cards" :key="i">
                <playing-card-container :card="card" :hide-card="participant.didFold || hideCard(i)" />
            </div>
        </div>

        <div :class="{ metadata: true, 'disconnected': !playerData.isConnected }">
            <div class="participant">
                <div class="name-hand">
                    <strong class="display-name">{{ playerData.player.displayName }}</strong>
                    <span v-if="participant.handRank" :class="{'hand-rank': true, 'is-winner': isWinner}">{{ participant.handRank }}</span>
                </div>
                <div class="chips">
                    {{ formatAmount(participant.balance) }}
                </div>
            </div>
            <div class="bet">
                <chip-stack :amount="chipStack" class="metadata-chip-stack"/>
            </div>
        </div>
    </div>
</template>

<script>
    import PlayingCardContainer from "../../PlayingCardContainer"
    import {mapGetters} from "vuex"
    import balance from "../../../mixins/balance"
    import ChipStack from "../../ChipStack"
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
            ...mapGetters({
                gameState: 'poker/gameState',
            }),
            isAction() {
                return this.participant.playerId === this.gameState.action
            },
            playerData() {
                return this.$store.getters.playerDataById(this.participant.playerId)
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
                return this.gameState.winners.indexOf(this.participant.playerId) >= 0
            },
            chipStack() {
                if (this.gameState.winners.length > 0) {
                    return this.isWinner ? this.participant.balance : 0
                }

                return this.participant.currentBet
            }
        },
        methods: {
            formatAmount,
            hideCard(index) {
                return index >= this.cards.length - this.hiddenCards
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
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../../variables.scss';

    $max-width: 599px;

    div.little-l-participant {
        border: 1px solid $border-color;
        padding:   $spacing-medium;

        &.is-action {
            border-color: $orange;
            box-shadow: 0 0 5px $orange;
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
            }

            &.disconnected {
                strong.display-name {
                    font-weight: normal;
                    font-style: italic;
                    color: $text-color-light;
                }
            }

            .participant {
                .name-hand {
                    .hand-rank {
                        display:     block;
                        font-size:   1.2em;
                        color: $text-color-light;

                        &.is-winner {
                            font-weight: bold;
                            color: black;
                        }
                    }
                }

                .chips {
                }
            }

            .bet {
                margin-left: auto;
            }
        }
    }
</style>