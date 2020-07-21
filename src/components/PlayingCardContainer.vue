<template>
    <div class="playing-card-container">
        <transition :name="transition" mode="out-in">
            <span v-if="hideCard"></span>
            <playing-card v-else-if="card" :suit="card.suit" :rank="card.rank" :is-wild="card.isWild" :key="`${card.rank}.${card.suit}`" />
            <playing-card-back v-else />
        </transition>
    </div>
</template>

<script>
    import PlayingCard from "./PlayingCard"
    import PlayingCardBack from "./PlayingCardBack"

    export default {
        name: "PlayingCardContainer",
        components: {PlayingCardBack, PlayingCard},
        data() {
            return {
                transition: 'flip',
            }
        },
        props: {
            card: Object,
            hideCard: Boolean,
        },
        watch: {
            card() {
                this.transition = 'flip'
            },
            hideCard(newVal) {
                this.transition = 'vanish'
                if (!newVal) {
                    setTimeout(() => {this.transition = 'flip'}, 500)
                }
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import '../variables.scss';

    div.playing-card-container {
        perspective:      200px;
        width:            100%;
        height:           0;
        padding-top:      calc(3.5 / 2.5 * 100%);
        position:         relative;
        background-color: #eee;
        border-radius:    $border-radius;
        box-shadow:       inset 2px 2px 2px rgba(black, 0.1);

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

    .vanish-enter-active, .vanish-leave-active {
        transition: all 300ms;
    }

    .vanish-enter, .vanish-leave-to {
        transform: translateY(-50%);
        opacity:   0;
    }
</style>