<template>
    <div class="playing-card" @click="$emit('click')">
        <div :class="classes">
            <span class="corner top-left">
                <span class="rank">{{ displayRank }}</span>
                <span class="suit"><mdi-icon :icon="displaySuit"/></span>
            </span>
            <span class="center">
                <mdi-icon :icon="displaySuit"/>
            </span>
            <span class="corner bottom-right">
                <span class="rank">{{ displayRank }}</span>
                <span class="suit"><mdi-icon :icon="displaySuit"/></span>
            </span>
            <mdi-icon class="wild" :icon="mdiStarCircleOutline" v-if="isWild"/>
        </div>
    </div>
</template>

<script>
import {mdiCardsClub, mdiCardsDiamond, mdiCardsHeart, mdiCardsSpade, mdiStar, mdiStarCircleOutline} from '@mdi/js'
import MdiIcon from "@/components/MdiIcon.vue"

export default {
    name: "PlayingCard",
    components: {MdiIcon},
    emits: ['click'],
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
        },
    },
    data() {
        return {
            mdiStarCircleOutline,
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
                case 'stars':
                    return mdiStar
            }

            throw new Error('unknown suit')
        },
    },
}
</script>

<style lang="scss" scoped>
@import '../variables.scss';

.playing-card {
    position:       relative;
    width:          100%;
    aspect-ratio:   2.5 / 3.5;
    container-type: inline-size;
}

div.big-card {
    background:    linear-gradient(135deg, #ffffff, #f5f0e8);
    border-radius: $border-radius-card;
    border:        1px solid #d0c8b8;

    position:      absolute;
    inset:         0;

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
        width:          min-content;
        align-items:    center;

        &.top-left {
            top:  2cqi;
            left: 2cqi;
        }

        &.bottom-right {
            bottom:    2cqi;
            right:     2cqi;
            transform: rotate(180deg);
        }

        .rank {
            font-size:   28cqi;
            line-height: 28cqi;
        }

        .suit {
            width:       24cqi;
            height:      24cqi;
            line-height: 0;
        }
    }

    .wild {
        position: absolute;
        left:     0;
        bottom:   0;
        width:    30%;
        fill:     $yellow;
    }

    .center {
        position:  absolute;
        top:       50%;
        left:      50%;
        transform: translate(-50%, -50%);
        width:     40cqi;
        height:    40cqi;
    }
}
</style>
