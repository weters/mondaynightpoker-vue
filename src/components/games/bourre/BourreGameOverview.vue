<template>
    <div class="bourre-game-overview">
        <div class="trump-card">
            <playing-card-container :card="trumpCard" v-if="trumpCard" />
        </div>
        <bourre-pot />
    </div>
    
</template>

<script>
    import BourrePot from "@/components/games/bourre/BourrePot"
    import {mapGetters} from "vuex"
    import PlayingCardContainer from "../../PlayingCardContainer"
    export default {
        name: "BourreGameOverview",
        components: {PlayingCardContainer, BourrePot},
        computed: {
            ...mapGetters({
                gameState: 'bourre/gameState',
            }),
            trumpCard() {
                return this.gameState && this.gameState.trumpCard
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../../variables.scss';
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