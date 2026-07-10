<template>
  <span :class="containerClass">
    <span class="rank">{{ rank }}</span>
    <mdi-icon
      class="suit"
      :icon="suit"
    />
  </span>
</template>

<script>
    import MdiIcon from "./MdiIcon.vue"
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
    .text-playing-card {
        border: 1px solid $hairline;
        border-radius: $radius-xs;
        background-color: $surface-card;
        color: $suit-black;
        padding: 0 2px;
        white-space: nowrap;

        svg {
            fill: $suit-black;
        }

        &.hearts, &.diamonds {
            color: $suit-red;
            svg {
                fill: $suit-red;
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

    // On the dark felt (e.g. inside the in-game dealer log) keep the chip readable
    // by anchoring it to the ivory card face.
    .in-game .text-playing-card {
        border-color: $card-face-edge;
        background-color: $card-face;
    }
</style>