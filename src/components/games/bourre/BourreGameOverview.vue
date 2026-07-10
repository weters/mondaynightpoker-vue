<template>
  <div class="bourre-game-overview">
    <div class="trump-card">
      <span class="label">Trump</span>
      <playing-card-container
        v-if="trumpCard"
        :card="trumpCard"
      />
    </div>
    <div class="pot">
      <span class="label">Pot</span>
      <bourre-pot />
    </div>
  </div>
</template>

<script>
    import BourrePot from "@/components/games/bourre/BourrePot.vue"
    import {mapState} from "pinia"
    import {useBourreStore} from "@/store/bourre"
    import PlayingCardContainer from "../../PlayingCardContainer.vue"
    export default {
        name: "BourreGameOverview",
        components: {PlayingCardContainer, BourrePot},
        computed: {
            ...mapState(useBourreStore, ['gameState']),
            trumpCard() {
                return this.gameState && this.gameState.trumpCard
            }
        }
    }
</script>

<style lang="scss" scoped>
    div.bourre-game-overview {
        display:         flex;
        align-items:     flex-start;
        justify-content: center;
        gap:             $space-6;
        padding:         $space-4 $space-4 $space-3;
        margin:          0 auto $spacing;
        max-width:       420px;
        background:      $felt-rail;
        border:          1px solid $felt-hairline;
        border-radius:   $radius-md;
        box-shadow:      $shadow-felt-sm;

        & > * {
            display:        flex;
            flex-direction: column;
            align-items:    center;
        }

        .label {
            font-size:      $fs-2xs;
            font-weight:    $fw-semibold;
            text-transform: uppercase;
            letter-spacing: $tracking-caps;
            color:          $on-felt-muted;
            margin-bottom:  $space-2;
        }

        .trump-card {
            width: 75px;
        }
    }
</style>