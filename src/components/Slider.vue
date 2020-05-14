<template>
    <div :class="{ container: true, expand }">
        <div class="slider">
            <a class="handle" href="#" @click="expand=!expand">
                <svg viewBox="0 0 24 24">
                    <path :d="mdiPlus" ref="path"/>
                </svg>
            </a>
            <div class="drawer">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
    import {mdiClose, mdiPlus} from '@mdi/js'
    import {interpolate} from 'flubber'
    import {tween} from 'popmotion'

    export default {
        name: "SideSlider",
        data() {
            return {
                mdiClose,
                mdiPlus,
                expand: false,
            }
        },
        watch: {
            expand(didExpand) {
                if (this.timeout) {
                    clearTimeout(this.timeout)
                }

                this.timeout = setTimeout(() => {
                    const [from, to] = didExpand ? [0, 1] : [1, 0]
                    const morph = interpolate(mdiPlus, mdiClose)
                    tween({
                        duration: 400,
                        from,
                        to,
                    })
                        .pipe(morph)
                        .start(value => this.$refs.path.setAttribute('d', value))
                }, 300)
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import '../variables';

    $button-height: 30px;
    $button-width:  50px;

    .container {
        position:  absolute;
        top:       0;
        right:     $spacing-medium;
        transform: translateY(-100%);
        overflow:  hidden;
    }

    .slider {
        display:        flex;
        flex-direction: column;
        align-items:    flex-end;
        transform:      translateY(calc(100% - #{$button-height}));
        transition:     transform 400ms, filter 400ms;
        z-index:        100;

        @at-root .expand & {
            transform: none;
        }

        .handle {
            background-color: $primary;
            color:            white;
            height:           $button-height;
            width:            $button-width;
            border-radius:    $border-radius $border-radius 0 0;
            position:         relative;
            z-index:          2;

            ::v-deep svg {
                fill:      white;
                width:     min($button-height, $button-width);
                height:    min($button-height, $button-width);
                position:  absolute;
                top:       50%;
                left:      50%;
                transform: translate(-50%, -50%);
            }
        }

        .drawer {
            border:                 1px solid $primary;
            border-top-width:       3px;
            border-bottom-width:    0;
            border-top-left-radius: $border-radius;
            background-color:       white;
            padding:                $spacing;
            position:               relative;
            z-index:                1;
        }
    }
</style>