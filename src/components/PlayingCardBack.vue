<template>
    <div class="playing-card-back">
        <mdi-icon :icon="mdiCardsPlayingOutline" />
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
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../variables.scss';

    div.playing-card-back {
        background:    linear-gradient($primary, $secondary);
        border-radius: $border-radius;

        svg {
            fill:      white;
            width:     75%;
            position:  absolute;
            top:       50%;
            left:      50%;
            transform: translate(-50%, -50%);
        }
    }
</style>