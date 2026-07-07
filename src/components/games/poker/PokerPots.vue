<template>
    <div class="poker-pots">
        <poker-pot
            v-for="(pot, i) in pokerState.pots"
            :key="i"
            :pot="pot"
            :index="i"
            :total-pots="pokerState.pots.length"
        />
    </div>
</template>

<script>
import PokerPot from "@/components/games/poker/PokerPot.vue"
import {mapState} from "pinia"
import {usePokerStore} from "@/store/poker"
export default {
    name: "PokerPots",
    components: {PokerPot},
    computed: {
        ...mapState(usePokerStore, ['pokerState'])
    }
}
</script>

<style lang="scss" scoped>
.poker-pots {
    display: flex;
    flex-wrap: wrap;
    gap:     $spacing-medium;
    @media (max-width: #{$mobile-max}) {
        flex-direction: column;
    }
}
</style>