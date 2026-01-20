<template>
    <div :class="{
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
}
</script>

<style lang="scss" scoped>
@import '../../../variables.scss';

div.texas-hold-em-hole-card {
    &.selected {
        position: relative;
        z-index: 1;

        &::before {
            border-radius:    $border-radius;
            content:          '';
            position:         absolute;
            background-color: #000a;
            top:              0;
            right:            0;
            bottom:           0;
            left:             0;
            z-index: 2;
        }

        &::after {
            position: absolute;
            top: 0;
            right: 5px;
            content: '\2715';
            color: $red;
            font-size: 2em;
            z-index: 3;
        }
    }
}
</style>