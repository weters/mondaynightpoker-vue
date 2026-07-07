<template>
  <div :class="classes">
    <div :class="`cards cards-${numHoleCards}`">
      <template
        v-for="(_, i) in numHoleCards"
        :key="i"
      >
        <playing-card-container
          :card="card(i)"
          :hide-card="participant.folded || card(i) === undefined"
        />
      </template>
    </div>

    <span class="name">{{ playerData.player.displayName }}</span>
    <span class="balance">{{ participant.balance > 0 ? formatAmount(participant.balance) : '(All-in)' }}</span>

    <chip-stack
      :amount="participant.winnings || participant.currentBet"
      class="chip-stack"
    />

    <div class="info">
      <span
        v-if="participant.handRank"
        class="hand"
      >{{ participant.handRank }}</span>
      <span
        v-else-if="lastAction"
        class="last-action"
      >{{ lastAction }}</span>
      <span
        v-else
        class="void"
      />
    </div>

    <dealer-button
      v-if="participant.playerId === pokerGameState.dealer"
      class="them-dealer-button"
    />
  </div>
</template>

<script>
import PlayingCardContainer from "@/components/PlayingCardContainer.vue"
import balance from "@/mixins/balance"
import ChipStack from "@/components/ChipStack.vue"
import DealerButton from "@/components/games/poker/DealerButton.vue"
import {mapState} from "pinia"
import {useRootStore} from "@/store"
import {usePokerStore} from "@/store/poker"
import {useTexasHoldEmStore} from "@/store/texasHoldEm"

export default {
    name: "TexasHoldEmParticipant",
    components: {DealerButton, ChipStack, PlayingCardContainer},
    mixins: [balance],
    props: {
        participant: {
            type: Object,
            required: true,
        },
    },
    computed: {
        // poker and texasHoldEm both expose a gameState getter; alias poker's
        ...mapState(usePokerStore, {pokerGameState: 'gameState'}),
        ...mapState(useTexasHoldEmStore, ['gameState']),
        ...mapState(useRootStore, ['playerDataById']),
        numHoleCards() {
            return this.pokerGameState.variant.holeCards
        },
        lastAction() {
            const lastAction = this.gameState.lastAction
            if (!lastAction) {
                return
            }

            if (lastAction.playerId === this.participant.playerId) {
                return lastAction.action.name
            }

            return ''
        },
        playerData() {
            return this.playerDataById(this.participant.playerId)
        },
        classes() {
            return {
                'texas-hold-em-participant': true,
                'current-turn': this.participant.playerId === this.gameState.currentTurn,
                won: this.participant.result === 'won',
                lost: this.participant.result === 'lost',
                'is-connected': this.playerData.isConnected,
            }
        },
    },
    methods: {
        card(index) {
            if (index < this.participant.cards.length) {
                return this.participant.cards[index]
            }

            return undefined
        },
    },
}
</script>

<style lang="scss" scoped>
div.texas-hold-em-participant {
    $root:          &;
    border:         1px solid $border-color;
    padding:        $spacing-small;
    display:        flex;
    flex-direction: column;
    position:       relative;

    &.current-turn {
        @include current-turn;
    }

    &:not(.is-connected) {
        span.name {
            font-style: italic;
            color:      $text-color-light;
        }
    }

    div.cards {
        display:               grid;
        grid-template-columns: 1fr 1fr;
        grid-gap:              2px;

        &.cards-3 {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    span.balance {
        display:   block;
        margin:    0;
        color:     $text-color-light;
        font-size: 0.7em;
    }

    .chip-stack {
        margin-top: auto;
        padding:    $spacing-small 0;
        align-self: center;
    }

    .info {
        & > span {
            font-size: 0.8em;
            padding:   4px;
        }

        .last-action {
            background-color: $peach;
            display:          block;
        }

        .hand {
            display:          block;
            color:            white;
            background-color: rgba(black, 0.75);
            margin:           0;

            @at-root #{$root}.won .info .hand {
                color:            white;
                background-color: $green;
            }

            @at-root #{$root}.lost .info .hand {
                background-color: $dark-green;
                color:            rgba(white, 0.5);
            }
        }

        .void {
            &::after {
                content: '\00a0';
            }
        }
    }

    .them-dealer-button {
        position: absolute;
        bottom:   $spacing-small;
        right:    $spacing-small;
    }
}
</style>