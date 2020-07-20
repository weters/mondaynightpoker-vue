<template>
    <div class="seven-card">
        <h3>{{gameState.name}}</h3>

        <div class="board">
            <chip-stack :amount="gameState.pot" />
        </div>

        <seven-card-participants />

        <poker-player-bar>
            <seven-card-hand />
        </poker-player-bar>
    </div>
</template>

<script>
    import {mapGetters} from "vuex"
    import SevenCardHand from "./SevenCardHand"
    import PokerPlayerBar from "../PokerPlayerBar"
    import ChipStack from "../../ChipStack"
    import SevenCardParticipants from "./SevenCardParticipants"

    export default {
        name: "SevenCard",
        components: {SevenCardParticipants, ChipStack, PokerPlayerBar, SevenCardHand},
        computed: {
            ...mapGetters({
                gameState: 'poker/gameState',
            })
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../../variables';
    .seven-card {
        div.board {
            width: min-content;
            margin: 0 auto $spacing-medium;
        }
    }
</style>