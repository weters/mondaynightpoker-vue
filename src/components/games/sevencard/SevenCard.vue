<template>
    <div class="seven-card">
        <h3>{{gameState.name}}</h3>

        <felt-table :participants="gameState.participants" :dealer-id="gameState.dealerId">
            <template #center>
                <div class="table-board">
                    <chip-stack :amount="gameState.pot" />
                </div>
            </template>

            <template #player="{ participant }">
                <seven-card-participant :participant="participant" />
            </template>
        </felt-table>

        <poker-player-bar>
            <seven-card-hand />
        </poker-player-bar>
    </div>
</template>

<script>
    import {mapGetters} from "vuex"
    import SevenCardHand from "./SevenCardHand.vue"
    import PokerPlayerBar from "../PokerPlayerBar.vue"
    import ChipStack from "../../ChipStack.vue"
    import SevenCardParticipant from "./SevenCardParticipant.vue"
    import FeltTable from "@/components/FeltTable.vue"

    export default {
        name: "SevenCard",
        components: {FeltTable, SevenCardParticipant, ChipStack, PokerPlayerBar, SevenCardHand},
        computed: {
            ...mapGetters({
                gameState: 'poker/gameState',
            }),
        },
    }
</script>

<style lang="scss" scoped>
    @import '../../../variables';
    .seven-card {
        .table-board {
            :deep(.chip-stack) {
                margin: 0 auto;
            }
        }
    }
</style>
