<template>
  <div :class="['guts-hand', `guts-hand-${cardCount}`, { folded }]">
    <div
      v-for="(card, index) in hand"
      :key="`${card.rank}.${card.suit}`"
      :class="classForCard(card, index)"
      @click="selectCard(card)"
    >
      <playing-card-container
        :card="card"
        :hide-card="hideCard(index)"
      />
    </div>
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
        hiddenCards: {
            type: Number,
            default: 0,
        },
        canSelect: {
            type: Boolean,
            default: false,
        },
        modelValue: {
            type: Array,
            default: () => [],
        },
        folded: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['update:modelValue'],
    data() {
        return {
            selected: {},
        }
    },
    watch: {
        canSelect(canSelect) {
            if (!canSelect) {
                this.selected = {}
            }
        },
    },
    methods: {
        hideCard(index) {
            return index >= this.hand.length - this.hiddenCards
        },
        key(card) {
            return `${card.rank}.${card.suit}`
        },
        classForCard(card, index) {
            return {
                card: true,
                selectable: this.canSelect && !this.hideCard(index),
                selected: this.canSelect && this.selected[this.key(card)],
            }
        },
        selectCard(card) {
            if (!this.canSelect) return

            const key = this.key(card)
            if (this.selected[key]) {
                delete this.selected[key]
            } else {
                this.selected[key] = true
            }

            this.selected = Object.assign({}, this.selected)
            this.$emit('update:modelValue', this.hand.filter(c => this.selected[this.key(c)]))
        },
    },
}
</script>

<style lang="scss" scoped>
.guts-hand {
    display: flex;
    gap: 4px;

    & > .card {
        @include player-bar-card-size;
    }

    &.folded .card {
        opacity: 0.5;
        filter: grayscale(0.4);
    }

    .card {
        position: relative;
        transition: transform $dur-fast $ease-spring, box-shadow $dur-fast $ease-spring;

        &.selectable {
            cursor: pointer;
        }

        // Selected == marked to trade: the card lifts, gets a gold ring, and
        // shows an ember cross so the intent is unmistakable (not colour alone).
        &.selected {
            z-index: $z-raised;
            transform: translateY(-10%);
            box-shadow: $shadow-card-lift;

            &::before {
                content: '';
                position: absolute;
                inset: 0;
                border-radius: $radius-card;
                background: rgba(#000, 0.45);
                outline: 2px solid $gold;
                outline-offset: -2px;
                z-index: 2;
            }

            &::after {
                content: '\2715';
                position: absolute;
                top: 2px;
                right: 6px;
                color: $accent;
                font-size: 1.4em;
                font-weight: $fw-bold;
                z-index: 3;
            }
        }

        @media (prefers-reduced-motion: reduce) {
            transition: box-shadow $dur-fast linear;

            &.selected {
                transform: none;
            }
        }
    }
}
</style>
