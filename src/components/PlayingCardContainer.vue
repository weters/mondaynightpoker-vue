<template>
  <div class="playing-card-container">
    <transition
      :name="transition"
      mode="out-in"
    >
      <span v-if="hideCard" />
      <playing-card
        v-else-if="card"
        :key="`${card.rank}.${card.suit}`"
        :suit="card.suit"
        :rank="card.rank"
        :is-wild="card.isWild"
      />
      <playing-card-back v-else />
    </transition>
  </div>
</template>

<script>
import PlayingCard from "./PlayingCard.vue"
import PlayingCardBack from "./PlayingCardBack.vue"

export default {
    name: "PlayingCardContainer",
    components: {PlayingCardBack, PlayingCard},
    props: {
        card: Object,
        hideCard: Boolean,
    },
    data() {
        return {
            transition: 'flip',
        }
    },
    watch: {
        card() {
            this.transition = 'flip'
        },
        hideCard(newVal) {
            this.transition = 'vanish'
            if (!newVal) {
                setTimeout(() => {
                    this.transition = 'flip'
                }, 500)
            }
        },
    },
}
</script>

<style lang="scss" scoped>
div.playing-card-container {
    perspective:      200px;
    width:            100%;
    aspect-ratio:     2.5 / 3.5;
    position:         relative;
    background-color: rgba(#000, 0.06);
    border-radius:    $radius-card;
    overflow:         visible;

    & > * {
        position: absolute;
        inset:    0;
    }

    .background {
        border-radius:    $radius-card;
        box-shadow:       inset 1px 2px 2px rgba(#000, 0.1);
        background-color: rgba(#000, 0.1);
        border:           1px solid rgba(#000, 0.1);
        margin:           2px;
    }
}

.flip-leave-active {
    transition: transform $dur-normal $ease-accel;
}

.flip-enter-active {
    transition: transform $dur-normal $ease-standard;
}

.flip-leave-to {
    transform: rotateY(90deg);
}

.flip-enter-from {
    transform: rotateY(-90deg);
}

.vanish-enter-active, .vanish-leave-active {
    transition: transform $dur-normal $ease-standard, opacity $dur-normal $ease-standard;
}

.vanish-enter-from, .vanish-leave-to {
    transform: translateY(-50%);
    opacity:   0;
}

@media (prefers-reduced-motion: reduce) {
    .flip-leave-active,
    .flip-enter-active,
    .vanish-enter-active,
    .vanish-leave-active {
        transition: opacity $dur-fast linear;
    }

    .flip-leave-to,
    .flip-enter-from,
    .vanish-enter-from,
    .vanish-leave-to {
        transform: none;
    }
}
</style>
