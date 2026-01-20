<template>
    <div :class="{ 'bourre-player': true, 'is-turn': isCurrentTurn }">
        <div class="hand">
            <div class="cards">
                <template v-for="i in 5" :key="`playing-card-${i}`">
                    <playing-card-container
                        :hide-card="hideCard(i)"
                        :card="playingCard(i)"
                    />
                </template>
            </div>
        </div>

        <div :class="{ metadata: true, disconnected: !playerData.isConnected }">
            <span class="name">{{ playerData.player.displayName }}</span>
            <span class="balance">{{ formatAmount(player.balance) }}</span>
            <bourre-tricks-tally class="tricks" :tricks="player.tricksWon"/>
        </div>
    </div>
</template>

<script>
import {mapGetters} from "vuex"
import balance from '@/mixins/balance'
import BourreTricksTally from "@/components/games/bourre/BourreTricksTally.vue"
import {mdiCardsPlayingOutline} from '@mdi/js'
import PlayingCardContainer from "@/components/PlayingCardContainer.vue"

export default {
    name: "BourrePlayer",
    components: {PlayingCardContainer, BourreTricksTally},
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
            mdiCardsPlayingOutline,
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
        },
    },
    methods: {
        hideCard(index) {
            return !this.isPlayedCard(index) && !this.isUnplayedCard(index)
        },
        playingCard(index) {
            return this.isPlayedCard(index) ? this.playedCard : null
        },
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
@import '../../../variables.scss';

div.bourre-player {
    border: 1px solid $border-color;
    padding: $spacing-medium;
    max-width: 400px;

    &.is-turn {
        @include current-turn;
    }

    .hand {
        .cards {
            display:               grid;
            grid-template-columns: repeat(5, 1fr);
            grid-gap:              2px;

            .card-container {
                perspective: 200px;
                width:       100%;
                height:      0;
                padding-top: calc(3.5 / 2.5 * 100%);
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
            color:       $text-color-light;
            font-weight: normal;
            font-style:  italic;
        }

        .tricks {
            grid-column-start: 2;
            grid-row-start:    1;
        }
    }
}

.trade-in-leave-active, .trade-in-enter-active {
    transition: all 1s;
}

.trade-in-leave-to, .trade-in-enter-from {
    transform: translateY(-100%);
    opacity:   0;
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

.game-enter-from {
    transform: rotate3d(0, 1, 0, 90deg)
}
</style>