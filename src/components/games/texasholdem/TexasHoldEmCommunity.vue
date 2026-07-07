<template>
  <div class="texas-hold-em-community">
    <playing-card-container
      v-for="i in 5"
      :key="i"
      :card="card(i-1)"
    />
  </div>
</template>

<script>
import PlayingCardContainer from "@/components/PlayingCardContainer.vue"
import {mapState} from "pinia"
import {usePokerStore} from "@/store/poker"

export default {
    name: "TexasHoldEmCommunity",
    components: {PlayingCardContainer},
    computed: {
        ...mapState(usePokerStore, ['pokerState']),
        community() {
            return this.pokerState.community
        },
    },
    methods: {
        card(index) {
            if (index < this.community.length) {
                return this.community[index]
            }

            return null
        },
    },
}
</script>

<style lang="scss" scoped>
.texas-hold-em-community {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: $spacing-medium;
}

</style>