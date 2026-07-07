<template>
    <div class="guts-trade">
        <template v-if="hasTraded">
            <p class="waiting">Trade complete. Waiting for others...</p>
        </template>
        <template v-else-if="canTrade || isTradePhase">
            <p class="instruction">Select cards to trade (or keep all)</p>
            <div class="buttons">
                <template v-if="canTrade">
                    <confirm-button
                        :label="tradeButtonLabel"
                        confirm-text="Confirm?"
                        @confirmed="submitTrade"
                    />
                </template>
                <template v-else>
                    <!-- Future action: queue trade for when it's our turn -->
                    <button :class="{'future-action': true, pending: futureAction !== null}"
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
import ConfirmButton from "@/components/ConfirmButton.vue"

export default {
    name: "GutsTrade",
    components: {ConfirmButton},
    props: {
        selectedCards: {
            type: Array,
            default: () => [],
        },
    },
    emits: ['error', 'clearSelection'],
    data() {
        return {
            futureAction: null,
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
    },
    watch: {
        canTrade(newVal) {
            if (newVal && this.futureAction !== null) {
                this.submitTradeWithCards(this.futureAction)
            }
        },
        isTradePhase(newVal) {
            if (!newVal) {
                this.clearState()
            }
        },
        selectedCards() {
            if (this.futureAction !== null) {
                this.futureAction = null
            }
        },
    },
    methods: {
        getSelectedCards() {
            return this.selectedCards.map(card => {
                return `${card.rank}${card.suit.charAt(0)}`
            })
        },
        submitTrade() {
            this.submitTradeWithCards(this.getSelectedCards())
        },
        handleFutureAction() {
            if (this.futureAction !== null) {
                this.futureAction = null
                return
            }
            this.futureAction = this.getSelectedCards()
        },
        clearState() {
            this.futureAction = null
            this.$emit('clearSelection')
        },
        submitTradeWithCards(cards) {
            this.$store.dispatch('webSocketSend', {action: 'trade', additionalData: {cards}})
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
.guts-trade {
    text-align: center;

    .instruction {
        margin: 0 0 2px;
        font-weight: bold;
        font-size: 0.85em;
    }

    .buttons {
        display: flex;
        gap: $spacing-small;
        justify-content: center;

        button {
            min-width: 100px;
            font-weight: bold;

            &.future-action {
                background-color: #888;

                &.pending {
                    box-shadow: 0 0 5px 2px $yellow;
                }
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
