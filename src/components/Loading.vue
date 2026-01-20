<template>
    <transition name="loading" appear>
        <div class="loading">
            <svg viewBox="0 0 24 24">
                <path :d="mdiCardsClub" ref="path"/>
            </svg>
        </div>
    </transition>
</template>

<script>
    import {mdiCardsClub, mdiCardsDiamond, mdiCardsHeart, mdiCardsSpade} from '@mdi/js'
    import { interpolate } from 'flubber'
    import { animate } from "popmotion"

    const suitOrder = [mdiCardsClub, mdiCardsDiamond, mdiCardsHeart, mdiCardsSpade]

    export default {
        name: "Loading",
        data() {
            return {
                mdiCardsClub,
            }
        },
        mounted() {
            this.runAnimation(0)
        },
        beforeUnmount() {
            if (this.animation) {
                this.animation.stop()
            }
        },
        methods: {
            runAnimation(index) {
                const fromShape = suitOrder[index]
                const fromColor = index === 0 || index === 3 ? '#000' : '#e53935'
                index = (index + 1) % suitOrder.length
                const toShape = suitOrder[index]
                const toColor = index === 0 || index === 3 ? '#000' : '#e53935'

                const morph = interpolate(fromShape, toShape, {
                    maxSegmentLength: 1,
                })

                this.animation = animate({
                    from: 0,
                    to: 1,
                    duration: 900,
                    onUpdate: progress => {
                        this.$refs.path.setAttribute('d', morph(progress))
                        // Interpolate color manually
                        const r1 = parseInt(fromColor.slice(1, 3) || fromColor.slice(1, 2).repeat(2), 16)
                        const g1 = parseInt(fromColor.slice(3, 5) || fromColor.slice(2, 3).repeat(2), 16)
                        const b1 = parseInt(fromColor.slice(5, 7) || fromColor.slice(3, 4).repeat(2), 16)
                        const r2 = parseInt(toColor.slice(1, 3) || toColor.slice(1, 2).repeat(2), 16)
                        const g2 = parseInt(toColor.slice(3, 5) || toColor.slice(2, 3).repeat(2), 16)
                        const b2 = parseInt(toColor.slice(5, 7) || toColor.slice(3, 4).repeat(2), 16)
                        const r = Math.round(r1 + (r2 - r1) * progress)
                        const g = Math.round(g1 + (g2 - g1) * progress)
                        const b = Math.round(b1 + (b2 - b1) * progress)
                        this.$refs.path.style.fill = `rgb(${r},${g},${b})`
                    },
                    onComplete: () => this.runAnimation(index)
                })
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import '../variables.scss';

    div.loading {
        position: relative;
        width:    40px;
        height:   40px;
    }

    .loading-enter-active {
        transition: all 200ms;
    }

    .loading-enter-from {
        opacity: 0;
    }
</style>
