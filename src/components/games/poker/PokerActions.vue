<template>
    <div class="poker-actions">
        <!-- Bet chips panel (overlays action buttons via grid stack) -->
        <div class="actions-stack">
            <transition name="fade" mode="out-in">
                <div v-if="betAction" key="bet" class="bet-panel">
                    <poker-bet-chips
                        :min-bet="pokerState.minBet"
                        :max-bet="maxBet"
                        :pot="pokerState.pot || 0"
                        :all-in-amount="allInAmount"
                        :action-name="betAction.name"
                        @submit="handleBetSubmit"
                        @cancel="betAction = null"
                    />
                </div>
                <div v-else key="actions" class="action-buttons">
                    <div class="buttons">
                        <confirm-button
                            v-for="action in actions"
                            :key="action.id"
                            :label="actionLabel(action)"
                            :confirm-text="actionConfirmText(action)"
                            :skip-confirm="isLowRisk(action)"
                            @confirmed="handleAction(action)"
                        />

                        <button
                            v-for="action in futureActions"
                            :key="'future-' + action.id"
                            :class="{'future-action': true, pending: futureAction && futureAction.id === action.id}"
                            type="button"
                            @click="handleFutureAction(action)"
                        >
                            <template v-if="action.id === 'call'">
                                {{ callLabel(action) }}
                            </template>
                            <template v-else>
                                {{ action.name }}
                            </template>
                        </button>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
import ConfirmButton from "@/components/ConfirmButton.vue"
import PokerBetChips from "./PokerBetChips.vue"
import balance from "@/mixins/balance"

export default {
    name: "PokerActions",
    components: {ConfirmButton, PokerBetChips},
    mixins: [balance],
    props: {
        actions: {
            type: Array,
            default: () => [],
        },
        futureActions: {
            type: Array,
            default: () => [],
        },
        selectedCards: {
            type: Array,
            default: () => [],
        },
        self: {
            type: Object,
            required: true,
        },
        pokerState: {
            type: Object,
            required: true,
        },
        gameState: {
            type: Object,
            required: true,
        },
    },
    emits: ['error'],
    data() {
        return {
            betAction: null,
            futureAction: null,
        }
    },
    computed: {
        maxBet() {
            return Math.min(this.pokerState.maxBet, this.self.balance)
        },
        amountToCall() {
            return this.pokerState.currentBet - this.self.currentBet
        },
        allInAmount() {
            return this.self.balance + this.self.currentBet
        },
        isTurn() {
            return this.gameState.currentTurn === this.self.playerId || this.gameState.action === this.self.playerId
        },
    },
    watch: {
        actions() {
            this.betAction = null
        },
        'gameState.round'() {
            this.betAction = null
            this.futureAction = null
        },
        isTurn(isTurn) {
            if (isTurn && this.futureAction) {
                if (Array.isArray(this.actions)) {
                    for (const action of this.actions) {
                        if (this.isFutureActionValid(action)) {
                            this.executeAction(this.futureAction.id)
                            break
                        }
                    }
                }
                this.futureAction = null
            }
        },
    },
    methods: {
        actionLabel(action) {
            if (action.id === 'call') return this.callLabel(action)
            if (action.id === 'flip-mushroom') return 'Flip Mushroom (lose card)'
            return action.name
        },
        actionConfirmText(action) {
            if (action.id === 'fold') return 'Confirm Fold?'
            if (action.id === 'call') return `Confirm ${this.callLabel(action)}?`
            return `Confirm ${action.name}?`
        },
        callLabel(action) {
            if (this.amountToCall >= this.self.balance) {
                return `All-in ${this.formatAmount(this.self.balance)}`
            }
            return `${action.name} ${this.formatAmount(this.amountToCall)}`
        },
        isLowRisk(action) {
            return ['next-round', 'check', 'play-antidote'].includes(action.id)
        },
        handleAction(action) {
            switch (action.id) {
                case 'discard':
                case 'trade':
                    this.$store.state.webSocket.send(action.id, null, this.selectedCards)
                        .catch(err => this.$emit('error', err))
                    break
                case 'check':
                case 'fold':
                case 'call':
                case 'end-game':
                case 'flip-mushroom':
                case 'next-round':
                case 'play-antidote':
                    this.executeAction(action.id)
                    break
                case 'raise':
                case 'bet':
                    this.betAction = action
                    break
                default:
                    throw new Error(`unknown action: ${action.id}`)
            }
        },
        executeAction(actionId) {
            this.$store.state.webSocket.send(actionId)
                .catch(err => this.$emit('error', err))
        },
        handleBetSubmit(amount) {
            let finalAmount = amount
            if (finalAmount > this.allInAmount) finalAmount = this.allInAmount
            if (finalAmount > this.maxBet) finalAmount = this.maxBet

            this.$store.state.webSocket.send(this.betAction.id, null, null, {amount: finalAmount})
                .catch(err => this.$emit('error', err))
        },
        handleFutureAction(action) {
            if (this.futureAction && this.futureAction.id === action.id) {
                this.futureAction = null
                return
            }

            if (action.id === 'call') {
                action.currentBet = this.pokerState.currentBet
            }

            this.futureAction = action
        },
        isFutureActionValid(action) {
            if (this.futureAction.id !== action.id) return false
            if (this.futureAction.id === 'call') {
                return this.futureAction.currentBet === this.pokerState.currentBet
            }
            return true
        },
    },
}
</script>

<style lang="scss" scoped>
@import '../../../variables';

.poker-actions {
    min-width: 0;
}

.actions-stack {
    position: relative;
}

.action-buttons {
    .buttons {
        display: flex;
        flex-wrap: wrap;
        gap: $spacing-small;
        justify-content: flex-end;
        margin: 0;
    }
}

button.future-action {
    background-color: #888;

    &.pending {
        box-shadow: 0 0 5px 2px $yellow;
    }
}

.fade-enter-active, .fade-leave-active {
    transition: opacity $transition-fast;
}

.fade-enter-from, .fade-leave-to {
    opacity: 0;
}
</style>
