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
    @import '../../../variables';

    .seven-card-hand {
        .hand {
            display: flex;
            gap: 3px;

            & > div.card {
                flex: 0 0 36px;
                width: 36px;

                @media (min-width: $mobile-max) {
                    flex: 0 0 52px;
                    width: 52px;
                }
            }
        }
    }
</style>