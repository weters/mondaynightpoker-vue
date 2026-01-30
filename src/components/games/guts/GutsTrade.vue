<template>
    <div class="guts-trade">
        <template v-if="hasTraded">
            <p class="waiting">Trade complete. Waiting for others...</p>
        </template>
        <template v-else-if="canTrade || isTradePhase">
            <p class="instruction">Select cards to trade (or keep all)</p>
            <div class="buttons">
                <!-- Confirmation mode -->
                <template v-if="confirm">
                    <button class="secondary" @click="confirm=null">Cancel</button>
                    <button @click="handleConfirm">Yes, {{ confirmLabel }}</button>
                </template>
                <!-- Future action confirmation -->
                <template v-else-if="confirmFuture">
                    <button class="secondary" @click="confirmFuture=null">Cancel</button>
                    <button class="future-action" @click="handleConfirmFuture">Yes, {{ confirmFutureLabel }}</button>
                </template>
                <!-- Normal mode -->
                <template v-else>
                    <button v-if="canTrade" @click="requestConfirm">
                        {{ tradeButtonLabel }}
                    </button>
                    <button v-else :class="{'future-action': true, pending: futureAction !== null}"
                            @click="handleFutureAction">
                        {{ futureButtonLabel }}
                    </button>
                </template>
            </div>
            <p v-if="!canTrade" class="waiting">Waiting for {{ currentTraderName }} to trade...</p>
        </template>
        <template v-else>
            <p class="waiting">Waiting for {{ currentTraderName }} to trade...</p>
        </template>
    </div>
</template>

<script>
import {mapGetters} from "vuex"

export default {
    name: "GutsTrade",
    props: {
        selectedCards: {
            type: Array,
            default: () => [],
        },
    },
    emits: ['error', 'clearSelection'],
    data() {
        return {
            confirm: null,
            confirmFuture: null,
            futureAction: null, // stores the queued trade cards array
        }
    },
    computed: {
        ...mapGetters({
            canTrade: 'guts/canTrade',
            currentTraderID: 'guts/currentTraderID',
            isTradePhase: 'guts/isTradePhase',
            hasTraded: 'guts/hasTraded',
        }),
        selectedCount() {
            return this.selectedCards.length
        },
        currentTraderName() {
            if (!this.currentTraderID) return 'player'
            const playerData = this.$store.getters.playerDataById(this.currentTraderID)
            return playerData ? playerData.player.displayName : 'player'
        },
        tradeButtonLabel() {
            if (this.selectedCount === 0) return 'Stand Pat'
            return `Trade ${this.selectedCount} Card${this.selectedCount > 1 ? 's' : ''}`
        },
        futureButtonLabel() {
            if (this.futureAction !== null) {
                const count = this.futureAction.length
                if (count === 0) return 'Stand Pat Queued'
                return `Trade ${count} Queued`
            }
            if (this.selectedCount === 0) return 'Queue Stand Pat'
            return `Queue Trade ${this.selectedCount}`
        },
        confirmLabel() {
            if (this.confirm.length === 0) return 'Stand Pat'
            return `Trade ${this.confirm.length} Card${this.confirm.length > 1 ? 's' : ''}`
        },
        confirmFutureLabel() {
            if (this.confirmFuture.length === 0) return 'Stand Pat'
            return `Trade ${this.confirmFuture.length} Card${this.confirmFuture.length > 1 ? 's' : ''}`
        },
    },
    watch: {
        canTrade(newVal) {
            if (newVal) {
                // If we have a queued future action, auto-submit it
                if (this.futureAction !== null) {
                    this.submitTradeWithCards(this.futureAction)
                    return
                }
            }
        },
        isTradePhase(newVal) {
            if (!newVal) {
                // Clear state when trade phase ends
                this.clearState()
            }
        },
        selectedCards() {
            // Clear future action if selection changes after queuing
            if (this.futureAction !== null) {
                this.futureAction = null
            }
            // Clear any pending confirmations
            this.confirm = null
            this.confirmFuture = null
        },
    },
    methods: {
        getSelectedCards() {
            // Convert card objects to "14h" format for server
            return this.selectedCards.map(card => {
                return `${card.rank}${card.suit.charAt(0)}`
            })
        },
        requestConfirm() {
            this.confirm = this.getSelectedCards()
        },
        handleConfirm() {
            this.submitTradeWithCards(this.confirm)
        },
        handleFutureAction() {
            // Toggle off if already queued
            if (this.futureAction !== null) {
                this.futureAction = null
                return
            }
            // Request confirmation for future action
            this.confirmFuture = this.getSelectedCards()
        },
        handleConfirmFuture() {
            this.futureAction = this.confirmFuture
            this.confirmFuture = null
        },
        clearState() {
            this.confirm = null
            this.confirmFuture = null
            this.futureAction = null
            this.$emit('clearSelection')
        },
        submitTradeWithCards(cards) {
            this.$store.state.webSocket.send('trade', null, null, {cards})
                .then(() => {
                    this.clearState()
                })
                .catch(err => {
                    this.$emit('error', err)
                    this.clearState()
                })
        },
    },
}
</script>

<style lang="scss" scoped>
@import '../../../variables';

.guts-trade {
    text-align: center;
    margin-bottom: $spacing-medium;

    .instruction {
        margin: 0 0 $spacing-small;
        font-weight: bold;
    }

    .buttons {
        display: flex;
        gap: $spacing-small;
        justify-content: center;

        button {
            min-width: 120px;
            padding: $spacing-small $spacing-medium;
            font-weight: bold;

            &.future-action {
                background-color: #888;

                &.pending {
                    box-shadow: 0 0 5px 2px $yellow;
                }
            }

            &.secondary {
                background-color: $gray;
                color: $text-color;
            }
        }
    }

    .waiting {
        color: $text-color-light;
        font-style: italic;
        margin: $spacing-small 0 0;
    }
}
</style>
