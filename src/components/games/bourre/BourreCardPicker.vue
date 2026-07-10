<template>
  <transition-group
    name="picker-playing-card"
    tag="div"
    :class="{ hand: true, locked: !canSelect}"
  >
    <playing-card
      v-for="card in sortedHand"
      :key="cardId(card)"
      :class="{ card: true, selected: selected[cardId(card)], 'cannot-play': !canPlayCard(card) }"
      :rank="card.rank"
      :suit="card.suit"
      @click="cardClicked(card)"
    />
  </transition-group>
</template>

<script>
    import PlayingCard from "@/components/PlayingCard.vue"
    import card from '@/mixins/card'
    import {mapState} from "pinia"
    import {useBourreStore} from "@/store/bourre"

    export default {
        name: "BourreCardPicker",
        components: {PlayingCard},
        mixins: [card],
        props: {
            canSelect: {
                type: Boolean,
                required: true,
            },
            maxSelect: {
                type: Number,
                required: true,
            },
            modelValue: {
                type: Array,
                required: true,
            },
            round: Number,
        },
        emits: ['update:modelValue'],
        data() {
            const selected = {}
            if (this.modelValue) {
                this.modelValue.forEach(val => selected[this.cardId(val)] = true)
            }
            return {
                selected,
            }
        },
        computed: {
            ...mapState(useBourreStore, ['hand', 'canPlayCard']),
            sortedHand() {
                return [...this.hand].sort((a, b) => {
                    const cmp = a.suit.localeCompare(b.suit)
                    if (cmp !== 0) return cmp

                    return a.rank < b.rank ? -1 : a.rank > b.rank ? 1 : 0
                })
            },
        },
        watch: {
            modelValue(newValue) {
                const selected = {}
                newValue.forEach(val => selected[this.cardId(val)] = true)
                this.selected = selected
            },
        },
        methods: {
            cardClicked(card) {
                if (!this.canSelect) {
                    return
                }

                if (!this.canPlayCard(card)) {
                    return
                }

                const cardId = this.cardId(card)
                if (this.selected[cardId]) {
                    delete (this.selected[cardId])
                } else {
                    if (Object.keys(this.selected).length < this.maxSelect) {
                        this.selected[cardId] = true
                    }
                }

                this.selected = Object.assign({}, this.selected)
                this.$emit('update:modelValue', Object.keys(this.selected).map(cardId => this.cardByCardId(cardId)))
            },
        },
    }
</script>

<style lang="scss" scoped>
    .hand {
        display: flex;
        gap: $space-1;
        max-width: 100%;
        min-width: 0;

        @media (max-width: $mobile-max) {
            justify-content: center;
        }

        & > * {
            @include player-bar-card-size;
            min-width: 0;
        }

        .card {
            display: inline-block;
            cursor:  pointer;
            transition: opacity $dur-fast $ease-standard, filter $dur-fast $ease-standard;

            &.cannot-play {
                opacity: 0.35;
                filter:  grayscale(0.4);
                cursor:  default;
            }
        }

        // "Selected" itself is styled by PlayingCard's own .selected treatment
        // (lift + gold outline, per spec 5.4) — here we only handle the
        // "can no longer act" (locked) dimming on top of that.
        &.locked .card {
            cursor: default;

            &.selected {
                opacity: 0.65;
            }
        }
    }

    .picker-playing-card-leave-active {
        transition: transform $dur-slow $ease-standard, opacity $dur-slow $ease-standard;
    }

    .picker-playing-card-leave-to.card.selected {
        transform: translateY(-100%);
        opacity:   0;
    }

    @media (prefers-reduced-motion: reduce) {
        .hand .card {
            transition: opacity $dur-fast linear;
        }

        .picker-playing-card-leave-active {
            transition: opacity $dur-fast linear;
        }

        .picker-playing-card-leave-to.card.selected {
            transform: none;
        }
    }
</style>