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

        <div :class="['games', { 'has-multiple': round.games.length > 1 }]">
            <div class="played-games" v-if="playedGames.length">
                <acey-deucey-game v-for="game in playedGames" :key="game.uuid" :game="game"
                                  :is-active="false" :mini="true"/>
            </div>
            <div class="active-game">
                <acey-deucey-game v-if="activeGame" :key="activeGame.uuid" :game="activeGame"
                                  :is-active="true"/>
            </div>
            <div class="upcoming-games" v-if="upcomingGames.length">
                <acey-deucey-game v-for="game in upcomingGames" :key="game.uuid" :game="game"
                                  :is-active="false" :mini="true"/>
            </div>
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
        playedGames() {
            return this.round.games.slice(0, this.activeGameIndex)
        },
        activeGame() {
            return this.round.games[this.activeGameIndex]
        },
        upcomingGames() {
            return this.round.games.slice(this.activeGameIndex + 1)
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
        margin-bottom: $spacing-medium;

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
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: $spacing-small;

    .active-game {
        flex: 1 1 0;
    }

    .played-games,
    .upcoming-games {
        display: flex;
        flex-direction: column;
        gap: $spacing-small;
        flex: 0 0 100px;
    }
}
</style>