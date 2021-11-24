<template>
    <div class="little-l">
        <h3>{{ gameState.name }}</h3>

        <div class="board">
            <little-l-community/>

            <poker-pots />
        </div>

        <little-l-participants/>

        <poker-player-bar :selected-cards="selectedCards">
            <little-l-hand :can-select="gameState.round === 0" v-model="selectedCards" class="bar-hand"/>
        </poker-player-bar>
    </div>
</template>

<script>
import LittleLCommunity from "./LittleLCommunity"
import {mapGetters, mapState} from "vuex"
import LittleLHand from "./LittleLHand"
import balance from "../../../mixins/balance"
import show_error from "../../../mixins/show_error"
import LittleLParticipants from "./LittleLParticipants"
import PokerPlayerBar from "../PokerPlayerBar"
import PokerPots from "@/components/games/poker/PokerPots"

export default {
    name: "LittleL",
    components: {PokerPots, PokerPlayerBar, LittleLParticipants, LittleLHand, LittleLCommunity},
    mixins: [balance, show_error],
    data() {
        return {
            selectedCards: [],
            confirm: null,
            bet: null,
            startingBet: 0,
            amount: 0,
        }
    },
    computed: {
        ...mapState(['game']),
        ...mapGetters({
            gameState: 'poker/gameState',
            pokerState: 'poker/pokerState',
        }),
        tradeIns() {
            const tradeIns = Object.keys(this.gameState.tradeIns)
            tradeIns.sort()


            const firstPart = tradeIns.slice(0, -1).join(', ')
            return `${firstPart} or ${tradeIns[tradeIns.length - 1]}`
        },
    },
}
</script>

<style lang="scss" scoped>
@import '../../../variables';

div.board {
    display:       flex;
    margin-bottom: $spacing;
    align-items:   flex-end;

    & > :first-child {
        flex: 1 0 100px;
    }

    & > :nth-child(2) {
        margin-left: $spacing;
    }

    ::v-deep .amount {
        font-size: 1.4em;
    }

    @media (max-width: #{$mobile-max}) {
        align-items: flex-start;
    }
}
</style>