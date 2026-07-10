<template>
  <div class="game-selector">
    <h3>Pick a Game</h3>

    <div
      v-if="canStart"
      class="games"
    >
      <component
        :is="g.selector"
        v-for="g in games"
        :key="g.slug"
        @submit="startGame($event, g.slug)"
      />
    </div>
    <div
      v-else
      class="waiting"
    >
      <p>Waiting on the table admin to start the game!</p>
      <loading />
    </div>
  </div>
</template>

<script>
import {mapActions, mapState} from "pinia"
import {useRootStore} from "@/store"
import Loading from "@/components/Loading.vue"
import games from "@/games"

export default {
    name: "GameSelector",
    components: {
        Loading,
    },
    data() {
        return {
            games,
        }
    },
    computed: {
        ...mapState(useRootStore, ['canStart']),
    },
    methods: {
        ...mapActions(useRootStore, ['webSocketSend']),
        // the registry slug is authoritative; the `game` field in the selector's
        // submit payload is ignored
        startGame({opts}, slug) {
            this.webSocketSend({action: 'createGame', subject: slug, additionalData: opts})
        },
    },
}
</script>

<style lang="scss" scoped>
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

            // The game being configured reads as the "selected" card.
            // Ring via box-shadow avoids any layout shift from a border change.
            &:focus-within {
                border-color: $accent;
                box-shadow: $shadow-hover, 0 0 0 2px $accent;
            }

            h4 {
                margin: 0 0 $spacing-medium;
                font-size: $fs-lg;
                font-weight: $fw-semibold;
                letter-spacing: $tracking-tight;
                color: $secondary;
                padding-bottom: $spacing-medium;
                border-bottom: 1px solid $hairline;
            }

            .buttons {
                margin-top: $spacing;
                padding-top: $spacing-medium;
                border-top: 1px solid $hairline;

                button[type="submit"] {
                    width: 100%;
                    padding: $spacing-medium;
                    font-weight: $fw-semibold;
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
            color: $ink-muted;
            margin: 0 0 $spacing;
        }

        .loading {
            display: inline-block;
        }
    }
}
</style>