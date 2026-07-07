<template>
    <div class="bourre-game-overview">
        <div class="trump-card">
            <playing-card-container :card="trumpCard" v-if="trumpCard" />
        </div>
        <bourre-pot />
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
        & > * {
            margin: 0 auto;
        }
        .trump-card {
            max-width: 75px;
        }

        & > :nth-child(2) {
            margin: $spacing-medium auto $spacing;
        }
    }
</style>