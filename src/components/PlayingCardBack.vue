<template>
    <div class="playing-card-back">
        <span class="border-frame">
            <span class="pattern">
                <span class="medallion">
                    <mdi-icon :icon="mdiCardsPlayingOutline"/>
                </span>
            </span>
        </span>
    </div>
</template>

<script>
import MdiIcon from "./MdiIcon.vue"
import {mdiCardsPlayingOutline} from "@mdi/js"

export default {
    name: "PlayingCardBack",
    components: {MdiIcon},
    data() {
        return {
            mdiCardsPlayingOutline,
        }
    },
}
</script>

<style lang="scss" scoped>
@use 'sass:color';
@import '../variables.scss';

$dark-orange: color.adjust($orange, $lightness: -10%);

div.playing-card-back {
    background:     #fff;
    border-radius:  $border-radius;
    position:       relative;
    border:         1px solid #d0c8b8;
    box-shadow:     0 0 2px rgba(black, 0.1), 1px 1px 1px rgba(black, 0.1);
    container-type: inline-size;

    .border-frame {
        display:       block;
        position:      absolute;
        inset:         5cqi;
        border:        2cqi solid $dark-orange;
        border-radius: 2cqi;
    }

    .pattern {
        display:          block;
        position:         absolute;
        inset:            0;
        background-color: $orange;
        background-image: repeating-linear-gradient(
                                  45deg,
                                  transparent,
                                  transparent 5cqi,
                                  $dark-orange 5cqi,
                                  $dark-orange 6cqi
                          ),
                          repeating-linear-gradient(
                                  135deg,
                                  transparent,
                                  transparent 5cqi,
                                  $dark-orange 5cqi,
                                  $dark-orange 6cqi
                          );
    }

    .medallion {
        display:       block;
        position:      absolute;
        top:           50%;
        left:          50%;
        transform:     translate(-50%, -50%);
        width:         36cqi;
        height:        36cqi;
        background:    $dark-orange;
        border:        3cqi solid white;
        border-radius: 50%;

        :deep(svg) {
            fill:      white;
            width:     60%;
            position:  absolute;
            top:       50%;
            left:      50%;
            transform: translate(-50%, -50%);
        }
    }
}
</style>
