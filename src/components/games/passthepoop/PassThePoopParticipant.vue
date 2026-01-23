<template>
    <div :class="{ 'ptp-participant': true, 'is-connected': isConnected }">
        <strong class="name">{{ playerData.player.displayName }}</strong>

        <div class="lives">
            <transition-group name="lives" class="lives">
                <mdi-icon :icon="mdiPokerChip" v-for="i in participant.lives" :key="i"/>
                <span class="placeholder" v-if="participant.lives === 0" :key="0"></span>
            </transition-group>
        </div>

        <div class="ptp-card-container">
            <playing-card-container class="ptp-card" :card="card" :hide-card="hideCard"/>
            <transition name="block">
                <span class="block-chip" v-if="participant.hasBlock"></span>
            </transition>
        </div>

        <span class="is-turn">
            <mdi-icon :icon="mdiCardsOutline" v-if="isPlayerTurn && goingToDeck"/>
            <mdi-icon :icon="mdiTimerSand" v-else-if="isPlayerTurn"/>
        </span>
    </div>
</template>

<script>
import MdiIcon from "../../MdiIcon.vue"
import {mdiCardsPlayingOutline, mdiPokerChip, mdiTimerSand, mdiCardsOutline} from '@mdi/js'
import PlayingCardContainer from "../../PlayingCardContainer.vue"

export default {
    name: "PassThePoopParticipant",
    components: {PlayingCardContainer, MdiIcon},
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
                        console.log("HIDE")
                        this.hideCard = true
                    }, 2000)
                } else {
                    this.hideCard = false
                }
            },
            immediate: true,
        },
        didTradeCard: {
            handler(didTradeCard) {
                this.hideCard = didTradeCard
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

    span.is-turn {
        display:    inline-block;
        width:      25px;
        height:     25px;
        margin-top: $spacing-small;
    }

    div.ptp-card-container {
        position: relative;
        width:    100%;

        .block-chip {
            position:         absolute;
            top:              5px;
            right:            5px;
            width:            19px;
            height:           19px;
            background-color: $red;
            border-radius:    50%;
            border:           2px dotted white;
            box-shadow:       2px 1px rgba(black, 0.3);

            fill:             $red;
            outline:          white 3px;
        }
    }
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

.block-leave-active {
    transition: 1000ms all;
}

.block-leave-to {
    transform: translateY(-200%);
    opacity:   0;
}
</style>