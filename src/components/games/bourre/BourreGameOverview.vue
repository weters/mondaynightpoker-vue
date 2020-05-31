<template>
    <div class="bourre-game-overview">
        <playing-card class="trump-card" :rank="trumpCard.rank" :suit="trumpCard.suit" v-if="trumpCard"/>
        <bourre-pot />
    </div>
    
</template>

<script>
    import PlayingCard from "@/components/PlayingCard"
    import BourrePot from "@/components/games/bourre/BourrePot"
    import {mapGetters} from "vuex"
    export default {
        name: "BourreGameOverview",
        components: {BourrePot, PlayingCard},
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
        width: min-content;
        text-align: center;
        margin: 0 auto $spacing;

        .trump-card {
            width: 50px;
        }
    }
</style>