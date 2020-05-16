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
    import {tween} from "popmotion"

    const suitOrder = [mdiCardsClub, mdiCardsDiamond, mdiCardsHeart, mdiCardsSpade]

    export default {
        name: "Loading",
        data() {
            return {
                mdiCardsClub,
            }
        },
        mounted() {
            console.log('ref', this.$refs.path)
            this.animate(0)
        },
        beforeDestroy() {
            this.animation.stop()
        },
        methods: {
            animate(index) {
                console.log('start animate')
                const fromShape = suitOrder[index]
                const fromColor = index === 0 || index === 3 ? '#000' : '#e53935'
                index = (index + 1) % suitOrder.length
                const toShape = suitOrder[index]
                const toColor = index === 0 || index === 3 ? '#000' : '#e53935'


                const morph = interpolate(fromShape, toShape, {
                    maxSegmentLength: 1,
                })

                this.animation = tween({
                    duration: 900,
                    from: {
                        svg: 0,
                        color: fromColor,
                    },
                    to: {
                        svg: 1,
                        color: toColor,
                    }
                }).pipe(val => ({
                    color: val.color,
                    svg: morph(val.svg)
                })).start({
                    update: val => {
                        this.$refs.path.setAttribute('d', val.svg)
                        this.$refs.path.style.fill = val.color
                    },
                    complete: () => this.animate(index)
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

    .loading-enter {
        opacity: 0;
    }
</style>