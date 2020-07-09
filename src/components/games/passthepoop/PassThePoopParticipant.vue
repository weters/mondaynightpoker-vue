<template>
    <div :class="{ 'ptp-participant': true, 'is-connected': isConnected }">
        <strong class="name">{{ playerData.player.displayName }}</strong>

        <transition-group name="lives" class="lives">
            <mdi-icon :icon="mdiPokerChip" v-for="i in participant.lives" :key="i"/>
            <span class="placeholder" v-if="participant.lives === 0" :key="0"></span>
        </transition-group>

        <div class="card-container">
            <div class="background"></div>
            <transition :name="cardTransition" mode="out-in">
                <span v-if="hideCard"></span>
                <playing-card v-else-if="card" :rank="card.rank" :suit="card.suit" :key="`${card.rank}.${card.suit}`"/>
                <div v-else class="card-back">
                    <mdi-icon :icon="mdiCardsPlayingOutline"/>
                </div>
            </transition>
        </div>

        <span class="is-turn">
            <mdi-icon :icon="mdiCardsOutline" v-if="isPlayerTurn && goingToDeck"/>
            <mdi-icon :icon="mdiTimerSand" v-else-if="isPlayerTurn"/>
        </span>
    </div>
</template>

<script>
    import MdiIcon from "../../MdiIcon"
    import {mdiCardsPlayingOutline, mdiPokerChip, mdiTimerSand, mdiCardsOutline} from '@mdi/js'
    import PlayingCard from "../../PlayingCard"

    export default {
        name: "PassThePoopParticipant",
        components: {PlayingCard, MdiIcon},
        props: {
            participant: {
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
                mdiCardsPlayingOutline,
                mdiPokerChip,
                mdiCardsOutline,
                mdiTimerSand,
                hideCard: false,
                cardTransition: 'flip-card',
            }
        },
        computed: {
            isConnected() {
                return this.playerData.isConnected
            },
            card() {
                return this.participant.card
            },
            isPlayerTurn() {
                return this.$store.getters['passThePoop/isPlayerTurn'](this.participant.playerId)
            },
            lastGameAction() {
                return this.$store.getters['passThePoop/gameData'].gameState.lastGameAction
            },
            goingToDeck() {
                return this.lastGameAction && this.lastGameAction.gameAction.name === 'Go to Deck'
            },
            didTradeCard() {
                const lastGameAction = this.lastGameAction
                return lastGameAction &&
                    lastGameAction.gameAction.name === 'Trade' &&
                    lastGameAction.playerId === this.participant.playerId
            },
        },
        watch: {
            'participant.isCardDead': {
                handler(isCardDead) {
                    if (isCardDead) {
                        setTimeout(() => {
                            this.cardTransition = 'trade-card'
                            this.$nextTick().then(() => this.hideCard = true)
                        }, 2000)
                    } else {
                        this.hideCard = false
                    }
                },
                immediate: true,
            },
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

        strong.name {
            overflow: hidden;
            display:  block;

            @media(max-width: 500px) {
                font-size: 10px;
            }
        }

        &:not(.is-connected) {
            strong.name {
                font-weight: normal;
                font-style:  italic;
                color:       $text-color-light;
            }
        }

        .lives {
            display:               grid;
            grid-template-columns: repeat(3, 1fr);
            grid-gap:              $spacing-small;
            margin:                $spacing-small 0;
            width:                 100%;
            align-items:           center;

            svg {
                width: 100%;
            }

            span.placeholder {
                width:       100%;
                padding-top: 100%;
                height:      0;
            }
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
            display:    inline-block;
            width:      25px;
            height:     25px;
            margin-top: $spacing-small;
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
        animation:       lose-life 500ms;
        animation-delay: 1000ms;
    }

    @keyframes lose-life {
        from {
            opacity:   1;
            transform: none;
        }
        to {
            opacity:   0;
            transform: translateY(-100%);
        }
    }
</style>