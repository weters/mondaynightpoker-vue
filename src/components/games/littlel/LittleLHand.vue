<template>
    <div class="little-l-hand">
        <div class="hand">
            <div
                    v-for="card in self.hand"
                    :key="`${card.rank}.${card.suit}`"
                    :class="classForCard(card)"
                    @click="selectCard(card)"
            >
                <playing-card-container :card="card"/>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from "vuex"
    import PlayingCardContainer from "../../PlayingCardContainer"

    export default {
        name: "LittleLHand",
        components: {PlayingCardContainer},
        props: {
            canSelect: Boolean,
            value: Array,
        },
        data() {
            return {
                selected: [],
            }
        },
        computed: {
            ...mapGetters({
                self: 'poker/self',
            }),
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
                this.$emit('input', this.self.hand.filter(c => this.selected[this.key(c)]))
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import '../../../variables.scss';

    div.hand {
        display: flex;

        & > * {
            flex: 0 1 100px;

            &:not(:first-child) {
                margin-left: $spacing-small;
            }
        }

        .card {
            position: relative;

            &.selected::after {
                border-radius:    $border-radius;
                content:          '';
                position:         absolute;
                top:              0;
                left:             0;
                right:            0;
                bottom:           0;
                background-color: rgba($red, 0.5);
            }
        }
    }
</style>