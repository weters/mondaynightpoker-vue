<template>
  <div class="community">
    <playing-card-container
      v-for="(card, i) in pokerState.community"
      :key="i"
      :card="card"
    />
  </div>
</template>

<script>
    import PlayingCardContainer from "../../PlayingCardContainer.vue"
    import {mapState} from "pinia"
    import {usePokerStore} from "@/store/poker"

    export default {
        name: "LittleLCommunity",
        components: {PlayingCardContainer},
        computed: {
            ...mapState(usePokerStore, ['pokerState'])
        }
    }
</script>

<style lang="scss" scoped>
    .community {
        max-width: 150px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        grid-gap: $spacing-small;

        & > :nth-child(2) {
            grid-column-start: 2;
            grid-row-start: 2;
        }

        & > :nth-child(3) {
            grid-column-start: 1;
            grid-row-start: 2;
        }
    }
</style>