<template>
    <div class="game-selector">
        <game-selector-acey-deucey @submit="startGame"/>
        <game-selector-bourre @submit="startGame"/>
        <game-selector-little-l @submit="startGame"/>
        <game-selector-pass-the-poop @submit="startGame"/>
        <game-selector-seven-card @submit="startGame"/>
    </div>
</template>

<script>
import GameSelectorAceyDeucey from "@/components/gameselector/GameSelectorAceyDeucey"
import GameSelectorSevenCard from "@/components/gameselector/GameSelectorSevenCard"
import GameSelectorLittleL from "@/components/gameselector/GameSelectorLittleL"
import GameSelectorPassThePoop from "@/components/gameselector/GameSelectorPassThePoop"
import GameSelectorBourre from "@/components/gameselector/GameSelectorBourre"

export default {
    name: "GameSelector",
    components: {
        GameSelectorBourre,
        GameSelectorPassThePoop,
        GameSelectorLittleL,
        GameSelectorSevenCard,
        GameSelectorAceyDeucey,
    },
    computed: {
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
    display: grid;
    grid-template-columns: repeat( auto-fit, minmax(250px, 1fr) );
    grid-gap: $spacing-medium;

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
            margin: 0;

            input {
                margin-right: $spacing-small;
            }
        }
    }
}
</style>