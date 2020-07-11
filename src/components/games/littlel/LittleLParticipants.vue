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
        $margin: calc(#{$spacing} * -1);
        display: flex;
        flex-flow: row wrap;
        margin: $margin;
        justify-content: center;

        & > * {
            margin: $spacing;
            flex: 0 0 calc(50% - #{$spacing} * 2);

            @media (min-width: 1000px) {
                flex: 0 0 calc(25% - #{$spacing} * 2);
            }
        }

        @media (max-width: 599px) {
            $margin: $spacing-small;
            margin: calc(#{$margin} * -1);

            & > * {
                margin: $margin;
                flex: 0 0 calc(50% - #{$margin} * 2);

                @media (min-width: 1000px) {
                    flex: 0 0 calc(25% - #{$margin} * 2);
                }
            }

        }
    }
</style>