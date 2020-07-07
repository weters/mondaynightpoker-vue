<template>
    <div class="little-l-participants">
        <little-l-participant v-for="p in gameState.participants" :key="p.playerId" :participant="p" />
    </div>
</template>

<script>
    import {mapGetters} from "vuex"
    import LittleLParticipant from "./LittleLParticipant"

    export default {
        name: "LittleLParticipants",
        components: {LittleLParticipant},
        computed: {
            ...mapGetters({
                gameState: 'littleL/gameState',
            })
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../../variables';
    .little-l-participants {
        $margin: calc(#{$spacing} / -2);
        display: flex;
        flex-flow: row wrap;
        margin: $margin;
        justify-content: center;

        & > * {
            margin: calc(#{$spacing} / 2);
            flex: 0 0 calc(50% - #{$spacing});

            @media (min-width: 1000px) {
                flex: 0 0 calc(25% - #{$spacing});
            }
        }
    }
</style>