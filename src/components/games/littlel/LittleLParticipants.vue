<template>
    <div class="little-l-participants">
        <little-l-participant v-for="p in gameState.participants" :key="p.playerId" :participant="p" />
    </div>
</template>

<script>
    import {mapState} from "pinia"
    import {usePokerStore} from "@/store/poker"
    import LittleLParticipant from "./LittleLParticipant.vue"

    export default {
        name: "LittleLParticipants",
        components: {LittleLParticipant},
        computed: {
            ...mapState(usePokerStore, ['gameState'])
        }
    }
</script>

<style lang="scss" scoped>
    .little-l-participants {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        grid-gap: $spacing;
    }
</style>