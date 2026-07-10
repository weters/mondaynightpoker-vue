<template>
  <div :class="playerClasses">
    <div class="hand">
      <div :class="['cards', `cards-${cardCount}`]">
        <template
          v-for="i in cardCount"
          :key="`playing-card-${i}`"
        >
          <playing-card-container
            :hide-card="hideCard(i)"
            :card="getCard(i)"
          />
        </template>
      </div>
    </div>

    <div :class="{ metadata: true, disconnected: !playerData.isConnected }">
      <span class="name">{{ playerData.player.displayName }}</span>
      <span class="balance">{{ formatAmount(participant.balance) }}</span>
      <span
        v-if="isWinner"
        class="result-badge winner"
      >Winner</span>
      <span
        v-else-if="isLoser"
        class="result-badge loser"
      >Paid Penalty</span>
      <span
        class="status-badge"
        :class="statusClass"
      >{{ statusText }}</span>
    </div>
  </div>
</template>

<script>
import {mapState} from "pinia"
import {useGutsStore} from "@/store/guts"
import balance from '@/mixins/balance'
import PlayingCardContainer from "@/components/PlayingCardContainer.vue"

export default {
    name: "GutsPlayer",
    components: {PlayingCardContainer},
    mixins: [balance],
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
            hiddenCards: 0,
        }
    },
    computed: {
        ...mapState(useGutsStore, ['phase', 'isShowdown', 'isTradePhase', 'decisions', 'showdownResult', 'cardCount']),
        playerDecision() {
            if (!this.decisions) return null
            return this.decisions[this.participant.playerId]
        },
        isWinner() {
            if (!this.showdownResult || !this.showdownResult.winnerIds) return false
            return this.showdownResult.winnerIds.includes(this.participant.playerId)
        },
        isLoser() {
            if (!this.showdownResult || !this.showdownResult.loserIds) return false
            return this.showdownResult.loserIds.includes(this.participant.playerId)
        },
        wentIn() {
            if (!this.showdownResult || !this.showdownResult.playersInIds) return false
            return this.showdownResult.playersInIds.includes(this.participant.playerId)
        },
        playerClasses() {
            return {
                'guts-player': true,
                'is-winner': this.isWinner,
                'is-loser': this.isLoser,
            }
        },
        showDecisions() {
            return this.isShowdown || this.isTradePhase
        },
        isFolded() {
            return this.showDecisions && this.playerDecision === false
        },
        statusClass() {
            if (this.showDecisions) {
                if (this.playerDecision === true) return 'in'
                if (this.playerDecision === false) return 'out'
            }
            if (this.participant.decided) return 'decided'
            return 'waiting'
        },
        statusText() {
            if (this.showDecisions) {
                if (this.playerDecision === true) return 'IN'
                if (this.playerDecision === false) return 'OUT'
            }
            if (this.participant.decided) return 'Decided'
            return 'Waiting...'
        },
    },
    watch: {
        'participant.traded'(newVal) {
            if (newVal > 0) {
                this.hiddenCards = newVal
                setTimeout(() => {
                    this.hiddenCards = 0
                }, 500)
            }
        },
    },
    methods: {
        hideCard(index) {
            // Hide cards if no cards in hand
            if (this.participant.cardsInHand < index) return true
            // Hide traded cards during animation (index is 1-based)
            if (this.hiddenCards > 0 && index > this.cardCount - this.hiddenCards) return true
            // Hide cards for players who folded during trade phase
            if (this.isFolded) return true
            // During declaration phase, show card backs
            if (!this.isShowdown) return false
            // After showdown, only show cards for players who went "In"
            return !this.wentIn
        },
        getCard(index) {
            // Only show actual cards during showdown for "In" players
            if (!this.isShowdown) return null
            if (!this.wentIn) return null
            if (!this.participant.hand) return null
            return this.participant.hand[index - 1] || null
        },
    },
}
</script>

<style lang="scss" scoped>
div.guts-player {
    background: $felt-rail;
    border: 1px solid $felt-hairline;
    border-radius: $radius-md;
    box-shadow: $shadow-felt-md;
    color: $on-felt;
    padding: $spacing-medium;
    max-width: 250px;
    transition: box-shadow $dur-normal $ease-standard;

    &.is-winner {
        box-shadow: $shadow-felt-md, $glow-winner;
    }

    &.is-loser {
        box-shadow: $shadow-felt-md, 0 0 0 2px rgba($negative, 0.55), 0 0 16px rgba($negative, 0.35);
    }

    @media (prefers-reduced-motion: reduce) {
        transition: box-shadow $dur-fast linear;
    }

    .hand {
        .cards {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-gap: 4px;

            &.cards-3 {
                grid-template-columns: repeat(3, 1fr);
            }
        }
    }

    .metadata {
        display: grid;
        grid-template-columns: 1fr auto;
        justify-items: start;
        align-items: center;
        margin-top: $spacing-small;
        gap: $spacing-small;

        .name {
            font-weight: $fw-semibold;
            grid-column: 1;
        }

        &.disconnected .name {
            color: $on-felt-faint;
            font-weight: $fw-regular;
            font-style: italic;
        }

        .balance {
            @include numeric;
            grid-column: 2;
            font-size: $fs-sm;
            color: $on-felt-muted;
        }

        .result-badge {
            grid-column: 1 / -1;
            font-size: $fs-2xs;
            font-weight: $fw-bold;
            text-transform: uppercase;
            letter-spacing: $tracking-wide;

            &.winner {
                color: $gold-soft;
            }

            &.loser {
                color: $negative;
            }
        }

        .status-badge {
            grid-column: 1 / -1;
            font-size: $fs-2xs;
            padding: 2px $space-2;
            border-radius: $radius-sm;
            text-transform: uppercase;
            letter-spacing: $tracking-wide;
            font-weight: $fw-bold;

            &.waiting {
                background: rgba(#000, 0.25);
                color: $on-felt-muted;
            }

            &.decided {
                background: $accent;
                color: $accent-ink;
            }

            &.in {
                background: $positive;
                color: #fff;
            }

            &.out {
                background: rgba(#000, 0.35);
                color: $on-felt-muted;
            }
        }
    }
}
</style>
