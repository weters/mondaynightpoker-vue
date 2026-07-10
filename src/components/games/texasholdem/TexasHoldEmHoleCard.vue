<template>
  <div
    :class="{
      'texas-hold-em-hole-card': true,
      selected,
    }"
    @click="$emit('selected', !selected)"
  >
    <playing-card-container
      :card="card"
    />
  </div>
</template>

<script>
import PlayingCardContainer from "@/components/PlayingCardContainer.vue"

export default {
    name: "TexasHoldEmHoleCard",
    components: {PlayingCardContainer},
    props: {
        card: Object,
        selected: Boolean,
    },
    emits: ['selected'],
}
</script>

<style lang="scss" scoped>
div.texas-hold-em-hole-card {
    cursor:        pointer;
    border-radius: $radius-card;
    transition:    transform $dur-fast $ease-spring,
                   box-shadow $dur-fast $ease-spring;

    // Selected == marked to discard: the card lifts, gets a gold ring, and
    // shows an ember cross so the intent is unmistakable (not colour alone).
    &.selected {
        position:   relative;
        z-index:    1;
        transform:  translateY(-10%);
        box-shadow: $shadow-card-lift;

        &::before {
            content:        '';
            position:       absolute;
            inset:          0;
            border-radius:  $radius-card;
            background:     rgba(#000, 0.45);
            outline:        2px solid $gold;
            outline-offset: -2px;
            z-index:        2;
        }

        &::after {
            content:     '\2715';
            position:    absolute;
            top:         2px;
            right:       6px;
            color:       $accent;
            font-size:   1.6em;
            font-weight: $fw-bold;
            z-index:     3;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        transition: box-shadow $dur-fast linear;

        &.selected {
            transform: none;
        }
    }
}
</style>