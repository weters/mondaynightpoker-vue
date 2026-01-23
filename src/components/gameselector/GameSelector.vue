<template>
    <div class="game-selector">
        <h3>Pick a Game</h3>

        <div class="games" v-if="canStart">
            <game-selector-acey-deucey @submit="startGame"/>
            <game-selector-bourre @submit="startGame"/>
            <game-selector-guts @submit="startGame"/>
            <game-selector-texas-hold-em @submit="startGame"/>
            <game-selector-seven-card @submit="startGame"/>
            <game-selector-little-l @submit="startGame"/>
            <game-selector-pass-the-poop @submit="startGame"/>
        </div>
        <div class="waiting" v-else>
            <p>Waiting on the table admin to start the game!</p>
            <loading/>
        </div>
    </div>
</template>

<script>
import GameSelectorAceyDeucey from "@/components/gameselector/GameSelectorAceyDeucey.vue"
import GameSelectorLittleL from "@/components/gameselector/GameSelectorLittleL.vue"
import GameSelectorPassThePoop from "@/components/gameselector/GameSelectorPassThePoop.vue"
import GameSelectorBourre from "@/components/gameselector/GameSelectorBourre.vue"
import GameSelectorGuts from "@/components/gameselector/GameSelectorGuts.vue"
import GameSelectorSevenCard from "@/components/gameselector/GameSelectorSevenCard.vue"
import {mapGetters} from "vuex"
import Loading from "@/components/Loading.vue"
import GameSelectorTexasHoldEm from "@/components/gameselector/GameSelectorTexasHoldEm.vue"

export default {
    name: "GameSelector",
    components: {
        GameSelectorTexasHoldEm,
        Loading,
        GameSelectorBourre,
        GameSelectorGuts,
        GameSelectorPassThePoop,
        GameSelectorLittleL,
        GameSelectorAceyDeucey,
        GameSelectorSevenCard,
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
    h3 {
        @include section-header;
    }

    div.games {
        display:               grid;
        grid-template-columns: repeat( auto-fit, minmax(280px, 1fr) );
        gap:                   $spacing;

        :deep(form) {
            @include card;
            @include card-hover;
            width: 100%;
            padding: $spacing;

            h4 {
                margin: 0 0 $spacing-medium;
                font-size: 1.1rem;
                font-weight: 600;
                color: $secondary;
                padding-bottom: $spacing-medium;
                border-bottom: 1px solid $border-color;
            }

            .buttons {
                margin-top: $spacing;
                padding-top: $spacing-medium;
                border-top: 1px solid $border-color;

                button[type="submit"] {
                    width: 100%;
                    padding: $spacing-medium;
                    font-weight: 500;
                }
            }
        }

        :deep(label) {
            width: auto;
            margin-bottom: $spacing-medium;

            input:not([type="checkbox"]):not([type="radio"]),
            select {
                width: 100%;
            }

            &.radio, &.checkbox {
                align-items: center;
                display:     flex;
                margin:      0 0 $spacing-small;

                input {
                    margin-right: $spacing-small;
                }
            }
        }
    }

    div.waiting {
        @include card;
        padding: $spacing * 2;
        text-align: center;

        p {
            color: $text-color-light;
            margin: 0 0 $spacing;
        }

        .loading {
            display: inline-block;
        }
    }
}
</style>