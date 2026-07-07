<template>
  <div :class="{'seven-card-participant': true, 'is-turn': isTurn }">
    <transition-group
      v-if="hand.length > 0"
      class="cards"
      tag="div"
      name="hand"
    >
      <div
        v-for="(card, i) in hand"
        :key="i+0"
        class="card"
      >
        <playing-card-container :card="card" />
      </div>
    </transition-group>
    <div
      v-else
      class="cards"
    >
      <div class="card">
        <playing-card-container :hide-card="true" />
      </div>
    </div>

    <chiggs-effects
      v-if="variantState"
      :participant="participant"
    />
    <coupons-clippings-effects
      v-if="variantState"
      :participant="participant"
      :order="order"
      :deal-delay="dealDelay"
    />

    <div :class="{ metadata: true, 'disconnected': !playerData.isConnected }">
      <div class="name-hand">
        <strong class="display-name">{{ playerData.player.displayName }}</strong>
        <span class="balance">{{ participant.balance > 0 ? formatAmount(participant.balance) : '(All-in)' }}</span>
        <span
          v-if="participant.handRank"
          :class="{'hand-rank': true, 'is-winner': isWinner}"
        >{{ participant.handRank }}</span>
        <span
          v-else-if="lastAction"
          class="last-action"
        >{{ lastAction }}</span>
      </div>
    </div>

    <div class="chips">
      <chip-stack :amount="chipStackAmount" />
    </div>

    <dealer-button
      v-if="participant.playerId === gameState.dealerId"
      class="dealer-button"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import PlayingCardContainer from '../../PlayingCardContainer.vue'
import ChipStack from '../../ChipStack.vue'
import DealerButton from '../poker/DealerButton.vue'
import ChiggsEffects from './ChiggsEffects.vue'
import CouponsClippingsEffects from './CouponsClippingsEffects.vue'
import { usePokerStore } from '@/store/poker'
import { useRootStore } from '@/store'
import { useDealAnimation } from '@/composables/useDealAnimation'
import { formatAmount } from '@/currency'

const props = defineProps({
    participant: {
        type: Object,
        required: true,
    },
})

const dealDelay = 200

const pokerStore = usePokerStore()
const rootStore = useRootStore()

const gameState = computed(() => pokerStore.gameState)
const variantState = computed(() => gameState.value?.variantState)
const playerData = computed(() => rootStore.playerDataById(props.participant.playerId))
const order = computed(() => gameState.value.participants.findIndex(p => p.playerId === props.participant.playerId))
const numParticipants = computed(() => gameState.value.participants.length)
const isTurn = computed(() => gameState.value.currentTurn === props.participant.playerId)

const isWinner = computed(() =>
    gameState.value.winners && Object.prototype.hasOwnProperty.call(gameState.value.winners, props.participant.playerId))

const lastAction = computed(() => {
    const action = gameState.value.lastAction
    if (!action || action.playerId !== props.participant.playerId) {
        return ''
    }

    return action.action.name
})

const chipStackAmount = computed(() => {
    if (gameState.value.winners) {
        return isWinner.value ? gameState.value.winners[props.participant.playerId] : 0
    }

    return props.participant.currentBet
})

const { hand } = useDealAnimation({
    cards: computed(() => props.participant.hand),
    order,
    participantCount: numParticipants,
    isOpeningDeal: computed(() => gameState.value.round <= 1),
    dealDelay,
})
</script>

<style lang="scss" scoped>
    div.seven-card-participant {
        border: 1px solid $border-color;
        padding:   $spacing-small;
        display: flex;
        flex-wrap: wrap;
        position: relative;

        &.is-turn {
            @include current-turn;
        }

        .dealer-button {
            position: absolute;
            top: $spacing-small;
            right: $spacing-small;
        }

        div.cards {
            display:  flex;
            position: relative;
            flex: 0 0 100%;

            & > div.card {
                flex: 0 1 50px;

                &:not(:first-child) {
                    margin-left: 2px;
                }
            }
        }

        .chips {
            margin-left: auto;
            margin-top: $spacing-small;
        }

        div.metadata {
            flex: 1 1 50%;
            display:    flex;
            flex-wrap:  wrap;
            margin-top: $spacing-small;

            strong.display-name {
                font-weight: normal;
            }

            span.balance {
                display: block;
                margin: 0;
                color: $text-color-light;
                font-size: 0.7em;
            }

            &.disconnected {
                font-style: italic;
                color: $text-color-light;
            }

            .hand-rank {
                display:     block;
                font-size:   1.2em;
                color: $text-color-light;

                &.is-winner {
                    font-weight: bold;
                    color: black;
                }
            }

            .last-action {
                display: block;
                font-size: 0.9em;
                color: $text-color-light;
                font-style: italic;
            }
        }
    }

    // Hand card animation
    .hand-enter-active {
        transition: all 250ms;
    }

    .hand-enter-from {
        transform: translateY(-100%);
        opacity:   0;
    }
</style>
