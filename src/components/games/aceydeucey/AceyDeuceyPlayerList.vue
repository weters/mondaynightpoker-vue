<template>
    <div class="acey-deucey-player-list">
        <acey-deucey-player
            v-for="participant in participants"
            :key="participant.playerId"
            :participant="participant"
            :player-data="playerDataById(participant.playerId)"
            />
    </div>
</template>

<script>
import {mapState} from "pinia"
import {useRootStore} from "@/store"
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
    computed: {
        ...mapState(useRootStore, ['playerDataById']),
    },
}
</script>

<style lang="scss" scoped>
.acey-deucey-player-list {
    display: flex;
    flex-wrap: wrap;
    margin: -1 * $spacing-medium;
}
</style>