<template>
    <div class="guts-hand">
        <playing-card-container
            v-for="(card, index) in hand"
            :key="index"
            :card="card"
        />
    </div>
</template>

<script>
import PlayingCardContainer from "@/components/PlayingCardContainer.vue"

export default {
    name: "GutsHand",
    components: {PlayingCardContainer},
    props: {
        hand: {
            type: Array,
            required: true,
        },
    },
}
</script>

<style lang="scss" scoped>
@import '../../../variables';

.guts-hand {
    display:               grid;
    grid-template-columns: repeat(2, minmax(50px, 100px));
    grid-gap:              $spacing-medium;
}
</style>
