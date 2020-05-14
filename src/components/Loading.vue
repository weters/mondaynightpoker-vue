<template>
    <transition name="loading" appear>
        <div class="loading">
            <mdi-icon class="suit clubs" :icon="mdiCardsClub"/>
            <mdi-icon class="suit heart" :icon="mdiCardsHeart"/>
            <mdi-icon class="suit diamond" :icon="mdiCardsDiamond"/>
            <mdi-icon class="suit spade" :icon="mdiCardsSpade"/>
        </div>
    </transition>
</template>

<script>
    import {mdiCardsClub, mdiCardsDiamond, mdiCardsHeart, mdiCardsSpade} from '@mdi/js'
    import MdiIcon from "@/components/MdiIcon"

    export default {
        name: "Loading",
        components: {MdiIcon},
        data() {
            return {
                mdiCardsClub,
                mdiCardsDiamond,
                mdiCardsHeart,
                mdiCardsSpade,
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import '../variables.scss';

    div.loading {
        position: relative;

        .suit {
            display:   inline-block;
            width:     20px;
            height:    20px;
            animation: 2s slide infinite;
            position:  absolute;
            top:       0;
            left:      0;
            opacity: 0;

            &:first-child {
                position: static;
            }

            &:nth-child(2) {
                animation-delay: 500ms;
            }

            &:nth-child(3) {
                animation-delay: 1000ms;
            }

            &:nth-child(4) {
                animation-delay: 1500ms;
            }

            &.heart, &.diamond {
                fill: $red;
            }

            @keyframes slide {
                from, 50%, 100% {
                    opacity:   0;
                    transform: scale(1);
                }

                25% {
                    opacity:   1;
                    transform: scale(1.2);
                }
            }
        }
    }

    .loading-enter-active {
        transition: all 200ms;
    }

    .loading-enter {
        opacity: 0;
    }
</style>