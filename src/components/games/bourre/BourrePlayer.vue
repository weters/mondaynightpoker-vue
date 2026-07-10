<template>
  <div :class="{ 'bourre-player': true, 'is-turn': isCurrentTurn }">
    <div class="hand">
      <div class="cards">
        <template
          v-for="i in 5"
          :key="`playing-card-${i}`"
        >
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
      <bourre-tricks-tally
        class="tricks"
        :tricks="player.tricksWon"
      />
    </div>
  </div>
</template>

<script>
import {mapState} from "pinia"
import {useBourreStore} from "@/store/bourre"
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
        ...mapState(useBourreStore, ['isTradeInRound', 'gameState']),
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
div.bourre-player {
    background:     $felt-rail;
    border:         1px solid $felt-hairline;
    border-radius:  $radius-md;
    box-shadow:     $shadow-felt-sm;
    color:          $on-felt;
    padding:        $space-3;
    max-width:      400px;
    transition:     box-shadow $dur-normal $ease-standard, border-color $dur-normal $ease-standard;

    &.is-turn {
        @include current-turn;
    }

    .hand {
        .cards {
            display:               grid;
            grid-template-columns: repeat(5, 1fr);
            grid-gap:              2px;
        }
    }

    .metadata {
        display:               grid;
        grid-template-columns: 1fr auto;
        justify-items:         start;
        align-items:           center;
        margin-top:            $space-2;

        .name {
            font-weight: $fw-semibold;
            font-size:   $fs-sm;
            color:       $on-felt;
        }

        .balance {
            @include numeric;
            color:     $on-felt-muted;
            font-size: $fs-xs;
        }

        &.disconnected .name {
            color:       $on-felt-faint;
            font-weight: $fw-regular;
            font-style:  italic;
        }

        .tricks {
            grid-column-start: 2;
            grid-row-start:    1;
        }
    }
}

.trade-in-leave-active, .trade-in-enter-active {
    transition: transform $dur-celebrate $ease-spring, opacity $dur-celebrate $ease-spring;
}

.trade-in-leave-to, .trade-in-enter-from {
    transform: translateY(-100%);
    opacity:   0;
}

.game-leave-active {
    transition: transform $dur-slow $ease-accel;
}

.game-enter-active {
    transition: transform $dur-slow $ease-standard;
}

.game-leave-to {
    transform: rotate3d(0, 1, 0, -90deg)
}

.game-enter-from {
    transform: rotate3d(0, 1, 0, 90deg)
}

@media (prefers-reduced-motion: reduce) {
    div.bourre-player {
        transition: box-shadow $dur-fast linear, border-color $dur-fast linear;
    }

    .trade-in-leave-active, .trade-in-enter-active {
        transition: opacity $dur-fast linear;
    }

    .trade-in-leave-to, .trade-in-enter-from {
        transform: none;
    }

    .game-leave-active, .game-enter-active {
        transition: none;
    }

    .game-leave-to, .game-enter-from {
        transform: none;
    }
}
</style>