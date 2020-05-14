<template>
    <div class="bourre-player">
        <div class="hand">
            <div class="cards">
                <template v-for="i in 5">
                    <div class="card-container" :key="i">
                        <div class="background"></div>
                        <transition :name="transitionName" mode="out-in">
                            <playing-card
                                    v-if="isPlayedCard(i)"
                                    class="played-card"
                                    :suit="playedCard.suit"
                                    :rank="playedCard.rank"
                                    :key="`playing-card-${i}`"
                                    :big-card="true"
                            />
                            <img v-else-if="isUnplayedCard(i)"
                                 src="../../assets/images/cards/blue_back.png"
                                 alt="back of card"
                                 :key="`img-${i}`"
                            />
                            <div v-else class="void" :key="`void-${i}`"></div>
                        </transition>
                    </div>
                </template>
            </div>
        </div>

        <div :class="{ metadata: true, disconnected: !playerData.isConnected }">
            <span class="name">{{ playerData.player.displayName}}</span>
            <span class="balance">{{ formatAmount(player.balance) }}</span>
            <bourre-tricks-tally class="tricks" :tricks="player.tricksWon"/>
            <mdi-icon class="poker-chip" :icon="mdiPokerChip" v-if="isCurrentTurn" />
        </div>
    </div>
</template>

<script>
    import {mapGetters} from "vuex"
    import PlayingCard from "@/components/PlayingCard"
    import balance from '@/mixins/balance'
    import BourreTricksTally from "@/components/games/BourreTricksTally"
    import {mdiPokerChip} from '@mdi/js'
    import MdiIcon from "@/components/MdiIcon"

    export default {
        name: "BourrePlayer",
        components: {MdiIcon, BourreTricksTally, PlayingCard},
        mixins: [balance],
        props: {
            player: {
                type: Object,
                required: true,
            },
            playerData: {
                type: Object,
                required: true,
            },
        },
        data() {
            return {
                mdiPokerChip,
            }
        },
        computed: {
            ...mapGetters({
                isTradeInRound: 'bourre/isTradeInRound',
                gameState: 'bourre/gameState',
            }),
            transitionName() {
                return this.isTradeInRound ? 'trade-in' : 'game'
            },
            playedCard() {
                return this.gameState.playedCards[this.player.playerId]
            },
            folded() {
                return this.player.folded
            },
            isCurrentTurn() {
                return this.gameState.currentTurn === this.player.playerId
            }
        },
        methods: {
            isUnplayedCard(index) {
                if (this.player.folded) {
                    return false
                }

                if (this.isTradeInRound) {
                    return index <= 5 - this.player.cardsDiscarded
                }

                return index <= this.player.cardsInHand
            },
            isPlayedCard(index) {
                if (this.player.folded || this.isTradeInRound) {
                    return false
                }

                return this.playedCard && index === this.player.cardsInHand + 1
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import '../../variables.scss';

    div.bourre-player {
        max-width: 400px;

        .hand {
            .cards {
                display:               grid;
                grid-template-columns: repeat(5, 1fr);
                grid-gap:              2px;

                .card-container {
                    perspective: 200px;
                    width:       100%;
                    height:      0;
                    padding-top: calc(1056 / 691 * 100%);
                    position:    relative;

                    & > * {
                        position: absolute;
                        top:      0;
                        right:    0;
                        bottom:   0;
                        left:     0;
                    }

                    .background {
                        border-radius:    $border-radius;
                        box-shadow:       inset 1px 2px 2px rgba(black, 0.1);
                        background-color: rgba(black, 0.1);
                        border:           1px solid rgba(black, 0.1);
                        margin:           2px;
                    }
                }
            }

            img {
                width: 100%;
            }

            .folded {
                background-color: $background-color;
                overflow:         hidden;
                width:            100%;
                height:           0;
                padding-top:      calc(1056 / 691 * 100%);
                border-radius:    $border-radius;
            }

            .playing-card {
                width:       100%;
                margin-left: 2px;
            }
        }

        .metadata {
            display:               grid;
            grid-template-columns: 1fr auto;
            justify-items:         start;
            align-items:           center;

            .name {
                font-weight: bold;
            }

            &.disconnected .name {
                color: $text-color-light;
                font-weight: normal;
                font-style: italic;
            }

            .tricks {
                grid-column-start: 2;
                grid-row-start:    1;
            }

            .poker-chip {
                grid-column-start: 2;
                grid-row-start: 2;
                width: 14px;
                justify-self: end;
                align-self: center;
                vertical-align: middle;
            }
        }
    }

    .trade-in-leave-active, .trade-in-enter-active {
        transition: all 1s;
    }

    .trade-in-leave-to, .trade-in-enter {
        transform: translateY(-100%);
        opacity: 0;
    }

    .game-leave-active {
        transition: all 500ms ease-in;
    }
    .game-enter-active {
        transition: all 500ms ease-out;
    }

    .game-leave-to {
        transform: rotate3d(0, 1, 0, -90deg)
    }
    .game-enter {
        transform: rotate3d(0, 1, 0, 90deg)
    }
</style>