<template>
    <div class="playing-card" @click="$emit('click')">
        <div :class="classes">
            <span class="corner">
                <span class="rank" ref="cornerRank">{{ displayRank }}</span>
                <span class="suit" ref="cornerSuit"><mdi-icon :icon="displaySuit"/></span>
            </span>
            <span class="center">
                <span class="suit"><mdi-icon :icon="displaySuit"/></span>
            </span>
            <mdi-icon class="wild" :icon="mdiStarCircleOutline" v-if="isWild" />
        </div>
    </div>
</template>

<script>
import {mdiCardsClub, mdiCardsDiamond, mdiCardsHeart, mdiCardsSpade, mdiStar, mdiStarCircleOutline} from '@mdi/js'
    import MdiIcon from "@/components/MdiIcon.vue"
    import {mapGetters} from "vuex"

    export default {
        name: "PlayingCard",
        components: {MdiIcon},
        props: {
            suit: {
                type: String,
                required: true,
            },
            rank: {
                type: Number,
                required: true,
            },
            isWild: {
                type: Boolean,
                default: false,
            }
        },
        data() {
            return {
                mdiCardsClub,
                mdiCardsDiamond,
                mdiCardsHeart,
                mdiCardsSpade,
                mdiStarCircleOutline,
                mdiStar,
            }
        },
        computed: {
            ...mapGetters({
                isTurn: 'bourre/isTurn',
            }),
            classes() {
                const classes = {
                    'big-card': true,
                }
                classes[this.suit] = true
                return classes
            },
            displayRank() {
                switch (this.rank) {
                    case 11:
                        return 'J'
                    case 12:
                        return 'Q'
                    case 13:
                        return 'K'
                    case 14:
                        return 'A'
                }

                return this.rank
            },
            displaySuit() {
                switch (this.suit) {
                    case 'clubs':
                        return mdiCardsClub
                    case 'diamonds':
                        return mdiCardsDiamond
                    case 'hearts':
                        return mdiCardsHeart
                    case 'spades':
                        return mdiCardsSpade
                    case 'stars':
                        return mdiStar
                }

                throw new Error('unknown suit')
            },
            formattedRank() {
                switch (this.rank) {
                    case 11:
                        return 'J'
                    case 12:
                        return 'Q'
                    case 13:
                        return 'K'
                    case 14:
                        return 'A'
                }

                return this.rank
            },
            card() {
                return `${this.formattedRank} of ${this.suit}`
            },
        },
        methods: {
            sizeCard() {
                const size = this.$el.clientHeight / 4
                this.$refs.cornerRank.style.fontSize = `${size}px`
                this.$refs.cornerRank.style.lineHeight = `${size}px`
                this.$refs.cornerSuit.style.width = `${size}px`
                this.$refs.cornerSuit.style.height = `${size}px`
            },
        },
        watch: {
            isTurn() {
                this.sizeCard()
            }
        },
        mounted() {
            window.addEventListener('resize', this.sizeCard)
            this.sizeCard()
        },
        beforeUnmount() {
            window.removeEventListener('resize', this.sizeCard)
        },
    }
</script>

<style lang="scss" scoped>
    @import '../variables.scss';

    .playing-card {
        position:    relative;
        height:      0;
        width:       100%;
        padding-top: calc(100% * 3.5 / 2.5);
    }

    div.big-card {
        background-color: white;
        border-radius:    $border-radius;
        border:           1px solid #eee;
        position:         absolute;
        top:              0;
        right:            0;
        bottom:           0;
        left:             0;

        &.hearts, &.diamonds {
            color: $red;

            :deep(svg) {
                fill: $red;

                &.wild {
                    fill: $yellow;
                }
            }
        }

        &.stars {
            color: $light-green;

            :deep(svg) {
                fill: $light-green;

                &.wild {
                    fill: $yellow;
                }
            }
        }

        .corner {
            position:       absolute;
            display:        flex;
            flex-direction: column;
            top:            2px;
            left:           2px;
            width:          min-content;
            align-items:    center;

            span.suit {
                line-height: 40%;
                height:      100%;
                width:       100%;
            }

            span.rank {
                font-size:   32px;
                line-height: 28px;
            }
        }

        .wild {
            position: absolute;
            left: 0;
            bottom: 0;
            width: 30%;
            fill: $yellow;
        }

        .center {
            position:  absolute;
            top:       45%;
            right:     45%;
            transform: translateX(50%);
            width:     60%;
        }
    }
</style>