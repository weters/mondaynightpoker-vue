<template>
    <div class="acey-deucey-player-list">
        <acey-deucey-player
            v-for="participant in participants"
            :key="participant.playerId"
            :participant="participant"
            :player-data="$store.getters.playerDataById(participant.playerId)"
            />
    </div>
</template>

<script>
import AceyDeuceyPlayer from "@/components/games/aceydeucey/AceyDeuceyPlayer.vue"
export default {
    name: "AceyDeuceyPlayerList",
    components: {AceyDeuceyPlayer},
    props: {
        participants: {
            type: Array,
            required: true,
        }
    },
}
</script>

<style lang="scss" scoped>
@import '../../../variables';
.acey-deucey-player-list {
    display: flex;
    flex-wrap: wrap;
    margin: -1 * $spacing-medium;
}
</style>