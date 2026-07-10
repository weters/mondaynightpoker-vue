<template>
  <div class="seven-card">
    <h3>{{ gameState.name }}</h3>

    <div class="board">
      <chip-stack :amount="gameState.pot" />
    </div>

    <seven-card-participants />

    <poker-player-bar>
      <seven-card-hand />
    </poker-player-bar>
  </div>
</template>

<script>
    import {mapState} from "pinia"
    import {usePokerStore} from "@/store/poker"
    import SevenCardHand from "./SevenCardHand.vue"
    import PokerPlayerBar from "../PokerPlayerBar.vue"
    import ChipStack from "../../ChipStack.vue"
    import SevenCardParticipants from "./SevenCardParticipants.vue"

    export default {
        name: "SevenCard",
        components: {SevenCardParticipants, ChipStack, PokerPlayerBar, SevenCardHand},
        computed: {
            ...mapState(usePokerStore, ['gameState']),
        },
    }
</script>

<style lang="scss" scoped>
    .seven-card {
        h3 {
            text-align: center;
            color: $gold-soft;
            border-bottom: 1px solid $felt-hairline;
            font-weight: $fw-semibold;
            letter-spacing: $tracking-tight;
        }

        div.board {
            width: min-content;
            margin: 0 auto $spacing;
            padding: $space-3 $space-4;
            background: $felt-surface;
            border: 1px solid $felt-hairline;
            border-radius: $radius-lg;
            box-shadow: inset 0 0 90px rgba(#000, 0.35), $shadow-felt-sm;

            :deep(.amount) {
                font-size: $fs-lg;
                color: $gold-soft;
                text-shadow: 0 0 12px rgba($gold, 0.4);
            }
        }
    }
</style>
