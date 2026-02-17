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
    import PlayingCardContainer from "../../PlayingCardContainer.vue"
    import {mapGetters} from "vuex"
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
                return this.gameState.winners && Object.prototype.hasOwnProperty.call(this.gameState.winners, this.participant.playerId)
            },
            chipStack() {
                if (this.gameState.winners) {
                    return this.gameState.winners[this.participant.playerId] || 0
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

    div.little-l-participant {
        @include felt-seat;

        &.is-action {
            @include felt-seat-active;
        }

        div.cards {
            display: flex;
            gap: 1px;

            & > * {
                flex: 1 1 0;
                min-width: 0;
            }
        }

        div.metadata {
            margin-top: 3px;
            display: grid;
            grid-template-columns: 1fr auto;

            strong.display-name {
                @include felt-seat-name;
            }

            &.disconnected {
                strong.display-name {
                    @include felt-seat-disconnected;
                }
            }

            .participant {
                .name-hand {
                    .hand-rank {
                        display:     block;
                        font-size:   0.75em;
                        color: rgba(255, 255, 255, 0.5);

                        &.is-winner {
                            font-weight: bold;
                            color: $light-green;
                        }
                    }
                }

                .chips {
                    @include felt-seat-balance;
                }
            }

            .bet {
                margin-left: auto;
            }
        }
    }
</style>