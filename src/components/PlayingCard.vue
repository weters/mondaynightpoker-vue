<template>
    <div class="playing-card" @click="$emit('click')">
        <div v-if="bigCard" :class="classes">
            <span>
                <span class="rank">{{ displayRank }}</span>
                <span class="suit"><mdi-icon :icon="displaySuit" /></span>
            </span>
        </div>
        <img :class="{'big-card': bigCard}" :src="image" :alt="`${card.rank} of ${card.suit}`" />
    </div>
</template>

<script>
    import {mdiCardsClub, mdiCardsDiamond, mdiCardsHeart, mdiCardsSpade} from '@mdi/js'
    import MdiIcon from "@/components/MdiIcon"

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
            bigCard: {
                type: Boolean,
                default: false,
            },
        },
        data() {
            return {
                mdiCardsClub,
                mdiCardsDiamond,
                mdiCardsHeart,
                mdiCardsSpade,
            }
        },
        computed: {
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
                }

                throw new Error('unknown suit')
            },
            image() {
                let suit
                switch (this.suit) {
                    case 'clubs':
                        suit = 'C'
                        break
                    case 'diamonds':
                        suit = 'D'
                        break
                    case 'hearts':
                        suit = 'H'
                        break
                    case 'spades':
                        suit = 'S'
                        break
                }
                return require(`../assets/images/cards/${this.formattedRank}${suit}.png`)
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
    }
</script>

<style lang="scss" scoped>
    @import '../variables.scss';
    img {
        width: 100%;

        &.big-card {
            @media(max-width: 374px) {
                display: none;
            }
        }
    }

    div.big-card {
        @media(min-width: 375px) {
            display: none;
        }

        background-color: white;
        border-radius: $border-radius;
        border: 1px solid #eee;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;

        &.hearts, &.diamonds {
            color: $red;

            ::v-deep svg {
                fill: $red;
            }
        }
        span.rank {
            display: block;
            font-size: 18px;
            position: absolute;
            top: 25%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
        span.suit {
            display: block;
            position: absolute;
            left: 50%;
            top: 75%;
            transform: translate(-50%, -50%);
            width: 18px;
        }
    }
</style>