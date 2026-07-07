<template>
  <div class="seven-card-participants">
    <seven-card-participant
      v-for="p in participants"
      :key="p.playerId"
      :participant="p"
    />
  </div>
</template>

<script>
    import {mapState} from "pinia"
    import {usePokerStore} from "@/store/poker"
    import SevenCardParticipant from "./SevenCardParticipant.vue"
    export default {
        name: "SevenCardParticipants",
        components: {SevenCardParticipant},
        computed: {
            ...mapState(usePokerStore, ['gameState']),
            participants() {
                return this.gameState.participants
            }
        }
    }
</script>

<style lang="scss" scoped>
    .seven-card-participants {
        display: flex;
        flex-wrap: wrap;
        margin: -2px;

        & > * {
            flex: 0 0 calc(50% - 4px);
            margin: 2px;

            @media (max-width: 599px) {
                flex: 0 0 100%;
            }
        }
    }
</style>