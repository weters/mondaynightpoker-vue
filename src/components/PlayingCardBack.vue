<template>
    <div class="playing-card-back">
        <span class="image">
        <mdi-icon :icon="mdiCardsPlayingOutline"/>
        </span>
    </div>
</template>

<script>
import MdiIcon from "./MdiIcon"
import {mdiCardsPlayingOutline} from "@mdi/js"

export default {
    name: "PlayingCardBack",
    components: {MdiIcon},
    data() {
        return {
            mdiCardsPlayingOutline,
            resizeObserver: null
        }
    },
    mounted: function () {
        this.resizeObserver = new ResizeObserver(els => {
            const cardBack = els[0].target
            const size = `${Math.ceil(cardBack.offsetWidth / 15)}px`
            cardBack.firstElementChild.style.top = size
            cardBack.firstElementChild.style.right = size
            cardBack.firstElementChild.style.bottom = size
            cardBack.firstElementChild.style.left = size
        })

        this.resizeObserver.observe(this.$el)
    },
    beforeDestroy() {
        this.resizeObserver.disconnect()
    }
}
</script>

<style lang="scss" scoped>
@import '../variables.scss';

div.playing-card-back {
    background:    #fff;
    border-radius: $border-radius;
    position:      relative;
    box-shadow:    0 0 2px rgba(black, 0.1), 1px 1px 1px rgba(black, 0.1);

    & > span.image {
        background-color: $orange;
        background-image: repeating-linear-gradient(45deg, transparent, transparent 4px, darken($orange, 6%) 5px, darken($orange, 6%) 6px),
                          repeating-linear-gradient(135deg, transparent, transparent 4px, darken($orange, 6%) 5px, darken($orange, 6%) 6px);
        border-radius:    2px;
        content:          '';
        display:          block;
        position:         absolute;
        top:              5px;
        left:             5px;
        right:            5px;
        bottom:           5px;
        z-index:          1;
    }

    svg {
        fill:      white;
        width:     75%;
        position:  absolute;
        top:       50%;
        left:      50%;
        transform: translate(-50%, -50%);
        z-index:   2;
    }
}
</style>