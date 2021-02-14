<template>
    <div class="game-selector">
        <h3>Pick a Game</h3>

        <div class="games" v-if="canStart">
            <game-selector-acey-deucey @submit="startGame"/>
            <game-selector-bourre @submit="startGame"/>
            <game-selector-texas-hold-em @submit="startGame" />
            <game-selector-little-l @submit="startGame"/>
            <game-selector-pass-the-poop @submit="startGame"/>
            <game-selector-seven-card @submit="startGame"/>
        </div>
        <div class="waiting" v-else>
            <p>Waiting on the table admin to start the game!</p>
            <loading />
        </div>
    </div>
</template>

<script>
import GameSelectorAceyDeucey from "@/components/gameselector/GameSelectorAceyDeucey"
import GameSelectorSevenCard from "@/components/gameselector/GameSelectorSevenCard"
import GameSelectorLittleL from "@/components/gameselector/GameSelectorLittleL"
import GameSelectorPassThePoop from "@/components/gameselector/GameSelectorPassThePoop"
import GameSelectorBourre from "@/components/gameselector/GameSelectorBourre"
import {mapGetters} from "vuex"
import Loading from "@/components/Loading"
import GameSelectorTexasHoldEm from "@/components/gameselector/GameSelectorTexasHoldEm"

export default {
    name: "GameSelector",
    components: {
        GameSelectorTexasHoldEm,
        Loading,
        GameSelectorBourre,
        GameSelectorPassThePoop,
        GameSelectorLittleL,
        GameSelectorSevenCard,
        GameSelectorAceyDeucey,
    },
    computed: {
        ...mapGetters(['canStart']),
        ws() {
            return this.$store.state.webSocket
        },
    },
    methods: {
        startGame({game, opts}) {
            this.ws.send('createGame', game, null, opts)
        },
    },
}
</script>

<style lang="scss" scoped>
@import '../../variables.scss';

div.game-selector {
    div.games {
        display:               grid;
        grid-template-columns: repeat( auto-fit, minmax(250px, 1fr) );
        grid-gap:              $spacing;

        ::v-deep form {
            width: 100%;
        }

        ::v-deep label {
            width: auto;

            input:not([type="checkbox"]):not([type="radio"]),
            select {
                width: 100%;
            }

            &.radio, &.checkbox {
                align-items: center;
                display:     flex;
                margin:      0;

                input {
                    margin-right: $spacing-small;
                }
            }
        }
    }
}
</style>