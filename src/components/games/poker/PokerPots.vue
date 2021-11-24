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
import PokerPot from "@/components/games/poker/PokerPot"
import {mapGetters} from "vuex"
export default {
    name: "PokerPots",
    components: {PokerPot},
    computed: {
        ...mapGetters({
            pokerState: 'poker/pokerState',
        })
    }
}
</script>

<style lang="scss" scoped>
@import '../../../variables';

.poker-pots {
    display: flex;
    gap:     $spacing-medium;
    @media (max-width: #{$mobile-max}) {
        flex-direction: column;
    }
}
</style>