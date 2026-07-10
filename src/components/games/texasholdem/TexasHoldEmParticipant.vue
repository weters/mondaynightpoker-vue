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
    background:      $felt-rail;
    border:         1px solid $felt-hairline;
    border-radius:  $radius-sm;
    box-shadow:     $shadow-felt-sm;
    color:          $on-felt;
    padding:        $space-1;
    display:        flex;
    flex-direction: column;
    position:       relative;
    transition:     box-shadow $dur-normal $ease-standard,
                    border-color $dur-normal $ease-standard,
                    opacity $dur-normal $ease-standard;

    // Turn — accent ring (mixin also drives the glow).
    &.current-turn {
        @include current-turn;
    }

    // Winner — gold ring, gold only ever appears on wins and the pot.
    &.won {
        border-color: $gold;
        box-shadow:   $glow-winner;
    }

    // Folded / lost — dimmed and desaturated (never colour alone).
    &.lost {
        opacity: 0.55;
        filter:  grayscale(0.4);
    }

    &:not(.is-connected) {
        span.name {
            font-style: italic;
            color:      $on-felt-faint;
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

    span.name {
        display:       block;
        margin-top:    $space-1;
        color:         $on-felt;
        font-size:     $fs-xs;
        font-weight:   $fw-semibold;
        white-space:   nowrap;
        overflow:      hidden;
        text-overflow: ellipsis;
    }

    span.balance {
        display:   block;
        margin:    0;
        @include   numeric;
        color:     $on-felt-muted;
        font-size: $fs-2xs;
    }

    .chip-stack {
        margin-top: auto;
        padding:    $space-1 0;
        align-self: center;
    }

    .info {
        & > span {
            font-size:     $fs-2xs;
            padding:       3px $space-1;
            border-radius: $radius-xs;
        }

        .last-action {
            background-color: rgba($peach, 0.18);
            color:            $peach;
            display:          block;
        }

        .hand {
            display:          block;
            color:            $on-felt;
            background-color: rgba(#000, 0.38);
            margin:           0;
            font-weight:      $fw-semibold;

            @at-root #{$root}.won .info .hand {
                color:            $mnp-ink-900;
                background-color: $gold;
            }

            @at-root #{$root}.lost .info .hand {
                background-color: rgba(#000, 0.38);
                color:            $on-felt-faint;
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
        bottom:   $space-1;
        right:    $space-1;
    }
}
</style>