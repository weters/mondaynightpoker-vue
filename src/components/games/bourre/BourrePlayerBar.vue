<template>
    <player-bar :error="error" :is-turn="isTurn">
        <template #cards>
            <template v-if="folded">
                <span class="folded-text">You folded</span>
            </template>
            <template v-else>
                <bourre-discard v-if="isTradeInRound" :hand="hand" @error="showError"/>
                <bourre-hand v-else :hand="hand" @error="showError"/>
            </template>
        </template>

        <template #gameInfo>
            <span class="round">
                <strong>Round:</strong>
                <span>{{ roundText }}</span>
            </span>
            <span class="turn">
                <strong>Turn:</strong>
                <span>{{ currentTurn }}</span>
            </span>
        </template>

        <template #settings>
            <p>Game balance: {{ formatAmount(gameData.balance) }}</p>
            <p><label class="optional"><span>Sit out</span><input type="checkbox" v-model="sitOut" :disabled="sitOutLoading"/></label></p>

            <template v-if="canRestart">
                <confirm-button
                    label="Restart"
                    confirm-text="Confirm Restart?"
                    @confirmed="newBourreGame"
                />
            </template>
        </template>
    </player-bar>
</template>

<script>
import PlayerBar from "@/components/games/PlayerBar.vue"
import BourreHand from "@/components/games/bourre/BourreHand.vue"
import BourreDiscard from "@/components/games/bourre/BourreDiscard.vue"
import ConfirmButton from "@/components/ConfirmButton.vue"
import {mapGetters} from "vuex"
import balance from "@/mixins/balance"
import show_error from "@/mixins/show_error"

export default {
    name: "BourrePlayerBar",
    components: {ConfirmButton, PlayerBar, BourreDiscard, BourreHand},
    mixins: [balance, show_error],
    data() {
        return {
            error: null,
            sitOut: !this.$store.getters.userClientState.active,
            sitOutLoading: false,
        }
    },
    computed: {
        ...mapGetters({
            isTradeInRound: 'bourre/isTradeInRound',
            hand: 'bourre/hand',
            folded: 'bourre/folded',
            isTurn: 'bourre/isTurn',
            round: 'bourre/round',
            gameState: 'bourre/gameState',
            gameData: 'bourre/gameData',
            canRestart: 'canRestart',
        }),
        roundText() {
            return this.round === 0 ? 'Play/Fold' : this.round
        },
        currentTurn() {
            if (!this.gameState.currentTurn) return
            return this.$store.getters.playerDataById(this.gameState.currentTurn).player.displayName
        },
    },
    watch: {
        sitOut(sitOut) {
            if (this.sitOutLoading) return
            this.sitOutLoading = true
            this.$store.dispatch('webSocketSend', {action: 'playerStatus', additionalData: {active: !sitOut}})
                .catch(err => {
                    this.sitOut = !sitOut
                    this.showError(err)
                })
                .finally(() => this.sitOutLoading = false)
        },
    },
    methods: {
        newBourreGame() {
            this.$store.dispatch('webSocketSend', {action: 'createGame', subject: 'bourre', additionalData: {ante: this.gameState.ante}})
                .catch(err => this.showError(err))
        },
    },
}
</script>

<style lang="scss" scoped>
@import '../../../variables';

.folded-text {
    color: $text-color-light;
    font-style: italic;
}
</style>
