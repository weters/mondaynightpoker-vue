<template>
    <div class="little-l">
        <h3>{{ gameState.name }}</h3>

        <felt-table :participants="gameState.participants">
            <template #center>
                <div class="table-board">
                    <little-l-community/>
                    <poker-pots />
                </div>
            </template>

            <template #player="{ participant }">
                <little-l-participant :participant="participant" />
            </template>
        </felt-table>

        <poker-player-bar :selected-cards="selectedCards">
            <little-l-hand :can-select="gameState.round === 0" v-model="selectedCards" class="bar-hand"/>
        </poker-player-bar>
    </div>
</template>

<script>
import LittleLCommunity from "./LittleLCommunity.vue"
import {mapGetters, mapState} from "vuex"
import LittleLHand from "./LittleLHand.vue"
import balance from "../../../mixins/balance"
import show_error from "../../../mixins/show_error"
import LittleLParticipant from "./LittleLParticipant.vue"
import PokerPlayerBar from "../PokerPlayerBar.vue"
import PokerPots from "@/components/games/poker/PokerPots.vue"
import FeltTable from "@/components/FeltTable.vue"

export default {
    name: "LittleL",
    components: {FeltTable, PokerPots, PokerPlayerBar, LittleLParticipant, LittleLHand, LittleLCommunity},
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

.little-l {
    .table-board {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: $spacing-small;

        :deep(.poker-pots) {
            justify-content: center;
        }

        :deep(.amount) {
            font-size: 1.2em;
        }
    }
}
</style>
