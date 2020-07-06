<template>
    <div class="playing-card-container">
        <transition name="flip" mode="out-in">
            <playing-card :suit="card.suit" :rank="card.rank" :key="`${card.rank}.${card.suit}`" v-if="card"/>
            <playing-card-back v-else/>
        </transition>
    </div>
</template>

<script>
    import PlayingCard from "./PlayingCard"
    import PlayingCardBack from "./PlayingCardBack"

    export default {
        name: "PlayingCardContainer",
        components: {PlayingCardBack, PlayingCard},
        props: {
            card: Object,
        },
    }
</script>

<style lang="scss" scoped>
    @import '../variables.scss';

    div.playing-card-container {
        perspective: 200px;
        width:       100%;
        height:      0;
        padding-top: calc(3.5 / 2.5 * 100%);
        position:    relative;

        & > * {
            position: absolute;
            top:      0;
            right:    0;
            bottom:   0;
            left:     0;
        }

        .background {
            border-radius:    $border-radius;
            box-shadow:       inset 1px 2px 2px rgba(black, 0.1);
            background-color: rgba(black, 0.1);
            border:           1px solid rgba(black, 0.1);
            margin:           2px;
        }
    }

    .flip-leave-active {
        transition: all 300ms ease-in;
    }

    .flip-enter-active {
        transition: all 300ms ease-out;
    }

    .flip-leave-to {
        transform: rotateY(90deg);
    }

    .flip-enter {
        transform: rotateY(-90deg);
    }
</style>