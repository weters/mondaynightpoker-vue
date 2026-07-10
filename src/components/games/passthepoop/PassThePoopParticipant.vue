<template>
  <div :class="{ 'ptp-participant': true, 'is-connected': isConnected, 'current-turn': isPlayerTurn, 'is-out': participant.lives === 0 }">
    <strong class="name">{{ playerData.player.displayName }}</strong>

    <div class="lives">
      <transition-group
        name="lives"
        class="lives"
      >
        <mdi-icon
          v-for="i in participant.lives"
          :key="i"
          :icon="mdiPokerChip"
        />
        <span
          v-if="participant.lives === 0"
          :key="0"
          class="placeholder"
        />
      </transition-group>
    </div>

    <div class="ptp-card-container">
      <playing-card-container
        class="ptp-card"
        :card="card"
        :hide-card="hideCard"
      />
      <transition name="block">
        <span
          v-if="participant.hasBlock"
          class="block-chip"
        />
      </transition>
      <span
        v-if="participant.lives === 0"
        class="out-badge"
      >OUT</span>
    </div>

    <span class="is-turn">
      <mdi-icon
        v-if="isPlayerTurn && goingToDeck"
        :icon="mdiCardsOutline"
      />
      <mdi-icon
        v-else-if="isPlayerTurn"
        :icon="mdiTimerSand"
      />
    </span>
  </div>
</template>

<script>
import {mapState} from "pinia"
import {usePassThePoopStore} from "@/store/passThePoop"
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
        // the store's isPlayerTurn getter is aliased so the mapped function and this
        // participant-specific computed can coexist
        ...mapState(usePassThePoopStore, {isPlayerTurnById: 'isPlayerTurn', gameData: 'gameData'}),
        isPlayerTurn() {
            return this.isPlayerTurnById(this.participant.playerId)
        },
        lastGameAction() {
            return this.gameData.gameState.lastGameAction
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
.ptp-participant {
    background:     $felt-rail;
    border:         1px solid $felt-hairline;
    border-radius:  $radius-sm;
    box-shadow:     $shadow-felt-sm;
    color:          $on-felt;
    display:        flex;
    flex-direction: column;
    max-width:      100px;
    align-items:    center;
    padding:        $space-2;
    transition:     box-shadow $dur-normal $ease-standard,
                   border-color $dur-normal $ease-standard,
                   opacity $dur-normal $ease-standard;

    strong.name {
        overflow:      hidden;
        display:       block;
        width:         100%;
        text-align:    center;
        white-space:   nowrap;
        text-overflow: ellipsis;
        font-size:     $fs-xs;
        font-weight:   $fw-semibold;
        color:         $on-felt;

        @media(max-width: 500px) {
            font-size: $fs-2xs;
        }
    }

    &:not(.is-connected) {
        strong.name {
            font-weight: $fw-regular;
            font-style:  italic;
            color:       $on-felt-faint;
        }
    }

    // Turn — the single most important glance state (spec 5.3).
    &.current-turn {
        @include current-turn;
    }

    // Eliminated — dimmed + a clear textual "OUT" label, never colour alone.
    &.is-out {
        opacity: 0.5;
        filter:  grayscale(0.5);
    }

    .lives {
        display:               grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap:              $space-1;
        margin:                $space-1 0;
        width:                 100%;
        align-items:           center;

        svg {
            width: 100%;
            fill:  $peach;
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
        margin-top: $space-1;
        color:      $gold-soft;
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
            background-color: $negative;
            border-radius:    50%;
            border:           2px dotted rgba(#fff, 0.85);
            box-shadow:       2px 1px 0 rgba(#000, 0.3);
        }

        .out-badge {
            position:       absolute;
            inset:          0;
            display:        flex;
            align-items:    center;
            justify-content: center;
            background:     rgba(#000, 0.55);
            border-radius:  $radius-card;
            color:          $on-felt-faint;
            font-size:      $fs-2xs;
            font-weight:    $fw-bold;
            letter-spacing: $tracking-caps;
        }
    }
}

.lives-leave-active {
    animation:       lose-life $dur-slow;
    animation-delay: $dur-celebrate;
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
    transition: transform $dur-slow $ease-standard, opacity $dur-slow $ease-standard;
}

.block-leave-to {
    transform: translateY(-200%);
    opacity:   0;
}

@media (prefers-reduced-motion: reduce) {
    .ptp-participant {
        transition: opacity $dur-fast linear;
    }

    .lives-leave-active {
        animation: none;
    }

    .block-leave-active {
        transition: opacity $dur-fast linear;
    }

    .block-leave-to {
        transform: none;
    }
}
</style>