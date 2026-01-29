<template>
    <div :class="['guts-hand', `guts-hand-${cardCount}`]">
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
        cardCount: {
            type: Number,
            default: 2,
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

    &.guts-hand-3 {
        grid-template-columns: repeat(3, minmax(50px, 100px));
    }
}
</style>
