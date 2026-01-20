<template>
    <div class="little-l-participants">
        <little-l-participant v-for="p in gameState.participants" :key="p.playerId" :participant="p" />
    </div>
</template>

<script>
    import {mapGetters} from "vuex"
    import LittleLParticipant from "./LittleLParticipant.vue"

    export default {
        name: "LittleLParticipants",
        components: {LittleLParticipant},
        computed: {
            ...mapGetters({
                gameState: 'poker/gameState',
            })
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../../variables';
    .little-l-participants {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        grid-gap: $spacing;
    }
</style>