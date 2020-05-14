<template>
    <transition-group name="picker-playing-card" tag="div" :class="{ hand: true, locked: !canSelect}">
        <playing-card
                v-for="card in sortedHand"
                :key="cardId(card)"
                :class="{ card: true, selected: selected[cardId(card)] }"
                :rank="card.rank"
                :suit="card.suit"
                @click="cardClicked(card)"
        />
    </transition-group>
</template>

<script>
    import PlayingCard from "@/components/PlayingCard"
    import card from '@/mixins/card'
    import {mapGetters} from "vuex"

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
            value: {
                type: Array,
                required: true,
            },
            round: Number,
        },
        data() {
            const selected = {}
            this.value.forEach(val => selected[this.cardId(val)] = true)
            console.log('selected', selected)
            console.log('value', this.value)
            return {
                selected,
            }
        },
        computed: {
            ...mapGetters({
                hand: 'bourre/hand',
            }),
            sortedHand() {
                return [...this.hand].sort((a, b) => {
                    const cmp = a.suit.localeCompare(b.suit)
                    if (cmp !== 0) return cmp

                    return a.rank < b.rank ? -1 : a.rank > b.rank ? 1 : 0
                })
            },
        },
        watch: {
            value(newValue) {
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

                const cardId = this.cardId(card)
                if (this.selected[cardId]) {
                    delete (this.selected[cardId])
                } else {
                    if (Object.keys(this.selected).length < this.maxSelect) {
                        this.selected[cardId] = true
                    }
                }

                this.selected = Object.assign({}, this.selected)
                this.$emit('input', Object.keys(this.selected).map(cardId => this.cardByCardId(cardId)))
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import '../../variables';

    .hand {
        display:               grid;
        grid-template-columns: repeat(5, 1fr);
        grid-gap:              $spacing-small;

        .card {
            display: inline-block;

            &.selected {
                filter: invert(100%);

                @at-root .locked#{&} {
                    filter:    brightness(0.5);
                    transform: none;
                }
            }
        }
    }

    .picker-playing-card-leave.card.selected {
        filter: none;
    }

    .picker-playing-card-leave-active {
        transition: transform 400ms, opacity 400ms;
    }

    .picker-playing-card-leave-to.card.selected {
        transform: translateY(-100%);
        opacity:   0;
        filter: none;
    }
</style>