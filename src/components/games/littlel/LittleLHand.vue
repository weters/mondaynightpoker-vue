<template>
  <div class="little-l-hand">
    <div class="hand">
      <div
        v-for="card in self.hand"
        :key="`${card.rank}.${card.suit}`"
        :class="classForCard(card)"
        @click="selectCard(card)"
      >
        <playing-card-container :card="card" />
      </div>
    </div>
  </div>
</template>

<script>
    import {mapState} from "pinia"
    import {usePokerStore} from "@/store/poker"
    import PlayingCardContainer from "../../PlayingCardContainer.vue"

    export default {
        name: "LittleLHand",
        components: {PlayingCardContainer},
        props: {
            canSelect: Boolean,
            modelValue: Array,
        },
        emits: ['update:modelValue'],
        data() {
            return {
                selected: [],
            }
        },
        computed: {
            ...mapState(usePokerStore, ['self']),
        },
        watch: {
            canSelect(canSelect) {
                if (!canSelect) {
                    this.selected = {}
                }
            },
        },
        methods: {
            key(card) {
                return `${card.rank}.${card.suit}`
            },
            classForCard(card) {
                return {
                    card: true,
                    selected: this.canSelect && this.selected[this.key(card)],
                }
            },
            selectCard(card) {
                const key = this.key(card)
                if (this.selected[key]) {
                    delete (this.selected[key])
                } else {
                    this.selected[key] = true
                }

                this.selected = Object.assign({}, this.selected)
                this.$emit('update:modelValue', this.self.hand.filter(c => this.selected[this.key(c)]))
            },
        },
    }
</script>

<style lang="scss" scoped>
    div.hand {
        display: flex;
        gap: 3px;

        & > * {
            @include player-bar-card-size;
        }

        .card {
            position: relative;
            transition: transform $dur-fast $ease-spring, box-shadow $dur-fast $ease-spring;
            cursor: pointer;

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