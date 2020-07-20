<template>
    <div class="seven-card">
        <h3>{{gameState.name}}</h3>

        <poker-player-bar>
            <seven-card-hand />
        </poker-player-bar>
    </div>
</template>

<script>
    import {mapGetters} from "vuex"
    import SevenCardHand from "./SevenCardHand"
    import PokerPlayerBar from "../PokerPlayerBar"

    export default {
        name: "SevenCard",
        components: {PokerPlayerBar, SevenCardHand},
        computed: {
            ...mapGetters({
                gameState: 'poker/gameState',
            })
        }
    }
</script>

<style lang="scss" scoped>
    .seven-card {

    }
</style>