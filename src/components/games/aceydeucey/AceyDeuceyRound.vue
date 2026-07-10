<template>
  <div class="acey-deucey-round">
    <div class="metadata">
      <div class="pot">
        <span class="label">Pot</span>
        <acey-deucey-pot :pot="pot" />
      </div>
      <div class="deck">
        <span class="label">Deck</span>
        <cards-remaining :number="round.cardsRemaining" />
      </div>
    </div>

    <div class="games">
      <acey-deucey-game
        v-for="(game, i) in round.games"
        :key="game.uuid"
        :game="game"
        :is-active="i === activeGameIndex"
      />
    </div>
  </div>
</template>

<script>
import {mapState} from "pinia"
import {useAceyDeuceyStore} from "@/store/aceyDeucey"
import AceyDeuceyGame from "@/components/games/aceydeucey/AceyDeuceyGame.vue"
import AceyDeuceyPot from "@/components/games/aceydeucey/AceyDeuceyPot.vue"
import {animate} from "popmotion"
import CardsRemaining from "@/components/CardsRemaining.vue"

export default {
    name: "AceyDeuceyRound",
    components: {CardsRemaining, AceyDeuceyPot, AceyDeuceyGame},
    props: {
        round: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            pot: 0,
        }
    },
    computed: {
        ...mapState(useAceyDeuceyStore, ['gameState']),
        activeGameIndex() {
            return this.gameState.round.activeGameIndex
        },
    },
    watch: {
        'round.pot': {
            immediate: true,
            handler(pot, oldPot) {
                animate({
                    from: oldPot || 0,
                    to: pot,
                    duration: 500,
                    onUpdate: val => this.pot = Math.floor(Math.round(val) / 25) * 25
                })
            },
        },
    },
}
</script>

<style lang="scss" scoped>
.acey-deucey-round {
    .metadata {
        display: flex;
        justify-content: center;
        align-items: stretch;
        gap: $space-6;
        margin-bottom: $spacing;

        & > div {
            display: flex;
            flex-direction: column;
            align-items: center;

            & >:nth-child(2) {
                margin-top: auto;
            }
        }

        span.label {
            font-size:      $fs-2xs;
            font-weight:    $fw-semibold;
            text-transform: uppercase;
            letter-spacing: $tracking-caps;
            color:          $on-felt-muted;
            margin-bottom:  $space-2;
        }
    }
}

.games {
    display:               grid;
    grid-template-columns: 1fr;
    @media (min-width: 400px) {
        grid-template-columns: 1fr 1fr;
    }
    @media (min-width: 800px) {
        grid-template-columns: 1fr 1fr 1fr 1fr;
    }
    grid-gap:              $space-3;
}
</style>