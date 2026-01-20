<template>
    <div class="texas-hold-em-community">
        <playing-card-container :card="card(i-1)" v-for="i in 5" :key="i"/>
    </div>
</template>

<script>
import PlayingCardContainer from "@/components/PlayingCardContainer.vue"

export default {
    name: "TexasHoldEmCommunity",
    components: {PlayingCardContainer},
    computed: {
        community() {
            return this.$store.getters["poker/pokerState"].community
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
@import '../../../variables';
.texas-hold-em-community {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: $spacing-medium;
}

</style>