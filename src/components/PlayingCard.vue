<template>
    <div class="playing-card" @click="$emit('click')">
        <div :class="classes">
            <span class="center">
                <img v-if="courtImage" :src="courtImage" :srcset="courtSrcset" class="court-illustration" alt="">
                <mdi-icon v-else :icon="displaySuit"/>
            </span>
            <span class="corner top-left">
                <span class="rank">{{ displayRank }}</span>
                <span class="suit"><mdi-icon :icon="displaySuit"/></span>
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
        courtImage() {
            if (this.rank === 13) {
                return `/images/poker/king-${this.suit}.png`
            }
            return null
        },
        courtSrcset() {
            if (this.rank === 13) {
                const base = `/images/poker/king-${this.suit}`
                return `${base}.png 1x, ${base}@2x.png 2x, ${base}@3x.png 3x`
            }
            return null
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
    box-shadow:    inset 0 1px 3px rgba(0, 0, 0, 0.06),
                   inset 0 -1px 2px rgba(255, 255, 255, 0.8),
                   0 2px 6px rgba(0, 0, 0, 0.1);

    position:      absolute;
    inset:         0;
    overflow:      hidden;

    // Noise texture overlay
    &::before {
        content: '';
        position: absolute;
        inset: 0;
        background-image: radial-gradient(circle at 1px 1px, rgba(0,0,0,0.015) 1px, transparent 0);
        background-size: 4px 4px;
        pointer-events: none;
        z-index: 1;
    }

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
            text-shadow: 0 1px 1px rgba(0, 0, 0, 0.08);
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
        width:     52cqi;
        height:    52cqi;
        opacity:   0.85;

        .court-illustration {
            position:   absolute;
            top:        50%;
            left:       50%;
            transform:  translate(-50%, -50%);
            width:      60cqi;
            height:     95cqi;
            object-fit: fill;
        }
    }
}
</style>
