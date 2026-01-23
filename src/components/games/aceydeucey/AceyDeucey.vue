<template>
    <div class="acey-deucey">
        <h3>{{ gameState.name }}</h3>

        <acey-deucey-round :round="round"/>

        <acey-deucey-player-list :participants="gameState.participants"/>

        <player-bar :error="error" :is-turn="isTurn">
            <div class="acey-deucey-player-bar">
                <div class="amount" v-if="confirm && confirm.name.toLowerCase() === 'bet'">
                    <label class="optional">
                        <span>Amount</span>
                        <input type="range" min="25" step="25" :max="maxBet" v-model="amount"
                               v-show="!editingAmount"/>
                    </label>

                    <!-- Display Mode: Tappable -->
                    <chip-stack :amount="parseInt(amount, 10)" v-show="!editingAmount"
                                class="tappable" @click="startEditAmount"/>

                    <!-- Edit Mode: Text Input -->
                    <input type="text" inputmode="numeric" pattern="[0-9]*"
                           class="amount-input" v-show="editingAmount"
                           v-model="editAmountValue" ref="amountInput"
                           @blur="finishEditAmount" @keydown.enter="finishEditAmount"
                           @keydown.escape="cancelEditAmount"/>
                </div>
                <div class="buttons">
                    <template v-if="confirm">
                        <button type="button" class="secondary" @click="confirm=null">Cancel</button>
                        <button type="button" @click="executeAction(confirm)">Yes, {{ confirm.name }}</button>
                    </template>
                    <template v-else>
                        <button type="button"
                                v-for="action in actions"
                                :key="action.id"
                                @click="confirm=action">{{ action.name }}
                        </button>
                    </template>
                </div>
            </div>
        </player-bar>
    </div>
</template>

<script>
import PlayerBar from "@/components/games/PlayerBar.vue"
import AceyDeuceyRound from "@/components/games/aceydeucey/AceyDeuceyRound.vue"
import {mapGetters, mapState} from "vuex"
import show_error from "@/mixins/show_error"
import balance from "@/mixins/balance"
import AceyDeuceyPlayerList from "@/components/games/aceydeucey/AceyDeuceyPlayerList.vue"
import ChipStack from "@/components/ChipStack.vue"

const defaultBet = '25'

export default {
    name: "AceyDeucey",
    components: {ChipStack, AceyDeuceyPlayerList, AceyDeuceyRound, PlayerBar},
    mixins: [show_error, balance],
    data() {
        return {
            error: null,
            confirm: null,
            amount: defaultBet,
            editingAmount: false,
            editAmountValue: '',
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
        }
    },
    methods: {
        executeAction(action) {
            this.webSocket.send('execute', String(action.id), null, {
                    amount: parseInt(this.amount, 10),
                })
                .then(() => {
                })
                .catch(err => this.showError(err))
        },
        startEditAmount() {
            this.editAmountValue = String(this.amount)
            this.editingAmount = true
            this.$nextTick(() => {
                this.$refs.amountInput.focus()
                this.$refs.amountInput.select()
            })
        },
        finishEditAmount() {
            const minBet = 25
            let value = parseInt(this.editAmountValue, 10)

            // Handle non-numeric input
            if (isNaN(value)) {
                value = minBet
            }

            // Clamp to valid range
            value = Math.max(minBet, Math.min(this.maxBet, value))

            // Round to step of 25
            value = Math.round(value / 25) * 25

            // Ensure still in bounds after rounding
            value = Math.max(minBet, Math.min(this.maxBet, value))

            this.amount = value
            this.editingAmount = false
        },
        cancelEditAmount() {
            this.editingAmount = false
        },
    },
    watch: {
        actions() {
            this.confirm = null
        },
        confirm(confirm) {
            if (confirm && confirm.name === 'Bet') {
                this.amount = defaultBet
            }
        },
    },
}
</script>

<style lang="scss" scoped>
@import '../../../variables.scss';
div.acey-deucey {
    div.acey-deucey-player-bar {
        display: flex;
        align-items: center;
        justify-content: center;

        div.amount {
            margin-right: $spacing;
            display: flex;
            align-items: center;
            flex: 0 1 250px;

            label {
                width: 100%;

                input[type="range"] {
                    width: 100%;
                }
            }

            .tappable {
                cursor: pointer;
                padding: 4px 8px;
                border-radius: 4px;

                &:hover {
                    background-color: rgba(255, 255, 255, 0.1);
                }
            }

            input.amount-input {
                width: 80px;
                text-align: center;
                font-size: 16px;
                padding: 4px;
                border: 2px solid $green;
                border-radius: 4px;
                background: $gray;
                color: $text-color;
            }
        }

        @media(max-width: 649px) {
            flex-direction: column;

            div.amount {
                flex: 0 0 auto;
            }
        }

        div.buttons {
            margin: 0;
        }
    }
}
</style>