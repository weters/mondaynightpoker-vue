<template>
    <div class="acey-deucey-round">
        <div class="metadata">
            <div class="pot">
                <span class="label">Pot</span>
                <acey-deucey-pot :pot="pot"/>
            </div>
            <div class="deck">
                <span class="label">Deck</span>
                <cards-remaining :number="round.cardsRemaining"/>
            </div>
        </div>

        <div class="games">
            <acey-deucey-game v-for="(game, i) in round.games" :key="game.uuid" :game="game"
                              :is-active="i === activeGameIndex"/>
        </div>
    </div>
</template>

<script>
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
        activeGameIndex() {
            return this.$store.getters["aceyDeucey/gameState"].round.activeGameIndex
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
@import '../../../variables';

.acey-deucey-round {
    .metadata {
        display: flex;
        justify-content: center;
        align-items: stretch;
        margin-bottom: $spacing;

        & > div {
            display: flex;
            flex-direction: column;
            margin: 2px;

            & >:nth-child(2) {
                margin-top: auto;
            }
        }

        span.label {
            font-weight: bold;
        }

        /* cards remaining */
        & > :nth-child(2) {
            margin-left: $spacing-medium;
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
    grid-gap:              $spacing-medium;
}
</style>