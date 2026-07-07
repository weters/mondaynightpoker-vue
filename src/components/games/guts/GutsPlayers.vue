<template>
  <div class="guts-players">
    <guts-player
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
import GutsPlayer from "@/components/games/guts/GutsPlayer.vue"

export default {
    name: "GutsPlayers",
    components: {GutsPlayer},
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
div.guts-players {
    $margin: calc(#{$spacing} / -2);
    display: flex;
    flex-flow: row wrap;
    margin: $margin;
    justify-content: center;

    & > * {
        margin: calc(#{$spacing} / 2);
        flex: 0 0 calc(50% - #{$spacing});

        @media (min-width: 800px) {
            flex: 0 0 calc(33.333% - #{$spacing});
        }

        @media (min-width: 1000px) {
            flex: 0 0 calc(25% - #{$spacing});
        }
    }
}
</style>
