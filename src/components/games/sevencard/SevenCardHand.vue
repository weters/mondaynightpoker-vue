<template>
    <div class="seven-card-hand">
        <div class="hand">
            <div v-for="(card, i) in self.hand" class="card" :key="i">
                <playing-card-container :card="card" />
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from "vuex"
    import PlayingCardContainer from "../../PlayingCardContainer.vue"

    export default {
        name: "SevenCardHand",
        components: {PlayingCardContainer},
        computed: {
            ...mapGetters({
                self: 'poker/self',
            })
        }
    }
</script>

<style lang="scss" scoped>
    .seven-card-hand {
        .hand {
            display: flex;
            width: 100%;
            margin: -3px;

            & > div.card {
                flex: 0 1 100px;
                margin: 3px;
            }
        }
    }
</style>