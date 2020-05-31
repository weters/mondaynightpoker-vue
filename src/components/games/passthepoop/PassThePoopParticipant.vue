<template>
    <div class="ptp-participant">
        <strong class="name">{{ participant.playerData.player.displayName }}</strong>

        <transition-group name="lives" class="lives">
            <mdi-icon :icon="mdiPokerChip" v-for="i in participant.lives" :key="i"/>
        </transition-group>

        <div class="card-container">
            <div class="background"></div>
            <transition :name="cardTransition" mode="out-in">
                <playing-card v-if="card" :rank="card.rank" :suit="card.suit" :key="`${card.rank}.${card.suit}`"/>
                <div v-else-if="!hideCard" class="card-back">
                    <mdi-icon :icon="mdiCardsPlayingOutline"/>
                </div>
            </transition>
        </div>

        <span class="is-turn">
            <mdi-icon :icon="mdiTimerSand" v-if="isPlayerTurn"/>
        </span>
    </div>
</template>

<script>
    import MdiIcon from "../../MdiIcon"
    import {mdiCardsPlayingOutline, mdiPokerChip, mdiTimerSand} from '@mdi/js'
    import PlayingCard from "../../PlayingCard"

    export default {
        name: "PassThePoopParticipant",
        components: {PlayingCard, MdiIcon},
        props: {
            participant: {
                type: Object,
                required: true,
            },
        },
        data() {
            return {
                mdiCardsPlayingOutline,
                mdiPokerChip,
                mdiTimerSand,
                hideCard: false,
                cardTransition: 'flip-card',
            }
        },
        computed: {
            card() {
                return this.participant.card
            },
            isPlayerTurn() {
                return this.$store.getters['passThePoop/isPlayerTurn'](this.participant.playerId)
            },
            didTradeCard() {
                const lastGameAction = this.$store.getters['passThePoop/gameData'].gameState.lastGameAction
                return lastGameAction &&
                    lastGameAction.gameAction.name === 'Trade' &&
                    lastGameAction.playerId === this.participant.playerId
            },
        },
        watch: {
            didTradeCard: {
                handler(trade) {
                    if (trade) {
                        this.cardTransition = 'trade-card'
                        this.$nextTick().then(() => this.hideCard = trade)
                    } else {
                        this.hideCard = trade
                        this.$nextTick().then(() => this.cardTransition = 'flip-card')
                    }
                },
                immediate: true,
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import '../../../variables';

    .ptp-participant {
        display:        flex;
        flex-direction: column;
        max-width:      100px;
        align-items:    center;


        .lives {
            height:                30px;
            display:               grid;
            grid-template-columns: repeat(3, 1fr);
            grid-gap:              $spacing-medium;
            width:                 100%;
            align-items:           center;
        }

        .card-container {
            padding-top: calc(100% * 3.5 / 2.5);
            height:      0;
            position:    relative;
            width:       100%;
            perspective: 200px;

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

            div.card-back {
                background:    linear-gradient($primary, $secondary);
                border-radius: $border-radius;

                svg {
                    fill:      white;
                    width:     75%;
                    position:  absolute;
                    top:       50%;
                    left:      50%;
                    transform: translate(-50%, -50%);
                }
            }
        }

        span.is-turn {
            display: inline-block;
            width:   25px;
        }
    }

    .flip-card-enter-active {
        transition: all 500ms ease-out;
    }

    .flip-card-leave-active {
        transition: all 500ms ease-in;
    }

    .flip-card-enter {
        transform: rotate3d(0, 1, 0, 90deg)
    }

    .flip-card-leave-to {
        transform: rotate3d(0, 1, 0, -90deg)
    }

    .trade-card-enter-active, .trade-card-leave-active {
        transition: all 500ms;
    }

    .trade-card-enter, .trade-card-leave-to {
        transform: translateY(-100%);
        opacity:   0;
    }

    .lives-leave-active {
        animation: lose-life 500ms;
        animation-delay: 1000ms;
    }

    @keyframes lose-life {
        from {
            opacity: 1;
            transform: none;
        }
        to {
            opacity: 0;
            transform: translateY(-100%);
        }
    }
</style>