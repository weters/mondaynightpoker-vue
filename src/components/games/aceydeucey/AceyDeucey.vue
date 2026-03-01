<template>
    <div class="acey-deucey">
        <h3>{{ gameState.name }}</h3>

        <acey-deucey-round :round="round"/>

        <acey-deucey-player-list :participants="gameState.participants"/>

        <player-bar :error="error" :is-turn="isTurn">
            <template #actions>
                <div class="acey-deucey-actions">
                    <poker-bet-chips
                        v-if="showBet"
                        :min-bet="25"
                        :max-bet="maxBet"
                        :all-in-amount="maxBet"
                        all-in-label="Max bet"
                        action-name="Bet"
                        @submit="executeBet"
                        @cancel="showBet = false"
                    />
                    <div class="buttons" v-else>
                        <confirm-button
                            v-for="action in actions"
                            :key="action.id"
                            :label="action.name"
                            :confirm-text="`Confirm ${action.name}?`"
                            :skip-confirm="action.name.toLowerCase() === 'bet'"
                            @confirmed="handleAction(action)"
                        />
                    </div>
                </div>
            </template>
        </player-bar>
    </div>
</template>

<script>
import PlayerBar from "@/components/games/PlayerBar.vue"
import AceyDeuceyRound from "@/components/games/aceydeucey/AceyDeuceyRound.vue"
import PokerBetChips from "@/components/games/poker/PokerBetChips.vue"
import ConfirmButton from "@/components/ConfirmButton.vue"
import {mapGetters, mapState} from "vuex"
import show_error from "@/mixins/show_error"
import AceyDeuceyPlayerList from "@/components/games/aceydeucey/AceyDeuceyPlayerList.vue"

export default {
    name: "AceyDeucey",
    components: {ConfirmButton, PokerBetChips, AceyDeuceyPlayerList, AceyDeuceyRound, PlayerBar},
    mixins: [show_error],
    data() {
        return {
            error: null,
            showBet: false,
        }
    },
    computed: {
        ...mapState(['game', 'webSocket']),
        ...mapGetters({
            gameState: 'aceyDeucey/gameState',
            actions: 'aceyDeucey/actions',
        }),
        isTurn() {
            return this.gameState.currentTurn === this.$store.state.user.player.id
        },
        round() {
            return this.gameState.round
        },
        maxBet() {
            return this.gameState.maxBet
        },
    },
    methods: {
        handleAction(action) {
            if (action.name.toLowerCase() === 'bet') {
                this.showBet = true
                return
            }
            this.webSocket.send('execute', String(action.id))
                .catch(err => this.showError(err))
        },
        executeBet(amount) {
            const betAction = this.actions.find(a => a.name.toLowerCase() === 'bet')
            if (!betAction) return
            this.webSocket.send('execute', String(betAction.id), null, {amount})
                .catch(err => this.showError(err))
        },
    },
    watch: {
        actions() {
            this.showBet = false
        },
    },
}
</script>

<style lang="scss" scoped>
@import '../../../variables.scss';

div.acey-deucey {
    .acey-deucey-actions {
        .buttons {
            display: flex;
            gap: $spacing-small;
            margin: 0;
        }
    }
}
</style>
