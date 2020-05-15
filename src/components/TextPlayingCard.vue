<template>
    <span :class="containerClass">
        <span class="rank">{{ rank }}</span>
        <mdi-icon class="suit" :icon="suit" />
    </span>
</template>

<script>
    import MdiIcon from "./MdiIcon"
    import {mdiCardsClub, mdiCardsDiamond, mdiCardsHeart, mdiCardsSpade} from "@mdi/js"
    export default {
        name: "TextPlayingCard",
        components: {MdiIcon},
        props: {
            card: {
                type: Object,
                required: true,
            }
        },
        data() {
            const containerClass = {
                'text-playing-card': true,
            }

            containerClass[this.card.suit] = true

            return {
                containerClass,
            }
        },
        computed: {
            rank() {
                switch (this.card.rank) {
                    case 11:
                        return 'J'
                    case 12:
                        return 'Q'
                    case 13:
                        return 'K'
                    case 14:
                        return 'A'
                }

                return this.card.rank
            }        ,
            suit() {
                switch (this.card.suit) {
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
            }
        }
    }
</script>

<style scoped lang="scss">
    @import '../variables';

    .text-playing-card {
        border: 1px solid $border-color;
        border-radius: $border-radius;
        background-color: white;
        padding: 0 2px;
        &.hearts, &.diamonds {
            color: $red;
            svg {
                fill: $red;
            }
        }

        & > * {
            vertical-align: middle;
        }
        svg {
            width: 10px;
            height: 10px;
        }
    }
</style>