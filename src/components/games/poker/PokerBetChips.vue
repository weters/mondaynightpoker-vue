<template>
    <div class="bet-chips">
        <div class="presets">
            <button
                v-for="preset in presets"
                :key="preset.label"
                :class="{ 'chip-pill': true, active: amount === preset.amount }"
                @click="selectPreset(preset)"
            >{{ preset.label }}</button>

            <button class="chip-pill custom" @click="toggleCustom">
                <template v-if="editingCustom">
                    <input
                        type="text"
                        inputmode="numeric"
                        pattern="[0-9]*"
                        class="custom-input"
                        v-model="customValue"
                        ref="customInput"
                        @blur="finishCustom"
                        @keydown.enter="finishCustom"
                        @keydown.escape="cancelCustom"
                        @click.stop
                    />
                </template>
                <template v-else>
                    {{ customLabel }}
                </template>
            </button>
        </div>

        <div class="bet-actions">
            <button class="secondary" type="button" @click="$emit('cancel')">Cancel</button>
            <button type="button" @click="$emit('submit', effectiveAmount)">{{ submitLabel }}</button>
        </div>
    </div>
</template>

<script>
import balance from "@/mixins/balance"

export default {
    name: "PokerBetChips",
    mixins: [balance],
    props: {
        minBet: {
            type: Number,
            required: true,
        },
        maxBet: {
            type: Number,
            required: true,
        },
        pot: {
            type: Number,
            default: 0,
        },
        allInAmount: {
            type: Number,
            required: true,
        },
        step: {
            type: Number,
            default: 25,
        },
        actionName: {
            type: String,
            default: 'Bet',
        },
    },
    emits: ['submit', 'cancel'],
    data() {
        return {
            amount: this.minBet,
            editingCustom: false,
            customValue: '',
        }
    },
    computed: {
        presets() {
            const list = []
            const {minBet, maxBet, pot, allInAmount} = this

            list.push({label: 'Min', amount: minBet})

            if (pot > 0) {
                const thirdPot = this.roundToStep(Math.floor(pot / 3))
                if (thirdPot > minBet && thirdPot < maxBet) {
                    list.push({label: '1/3 Pot', amount: thirdPot})
                }

                const halfPot = this.roundToStep(Math.floor(pot / 2))
                if (halfPot > minBet && halfPot < maxBet) {
                    list.push({label: '1/2 Pot', amount: halfPot})
                }

                const fullPot = this.roundToStep(pot)
                if (fullPot > minBet && fullPot < maxBet) {
                    list.push({label: 'Pot', amount: fullPot})
                }
            }

            if (allInAmount > minBet) {
                list.push({label: 'All-in', amount: Math.min(allInAmount, maxBet)})
            }

            return list
        },
        effectiveAmount() {
            return Math.min(this.amount, this.maxBet, this.allInAmount)
        },
        submitLabel() {
            if (this.effectiveAmount >= this.allInAmount) return `All-in ${this.formatAmount(this.allInAmount)}`
            return `${this.actionName} ${this.formatAmount(this.effectiveAmount)}`
        },
        customLabel() {
            // Show current amount if it doesn't match any preset
            const matchesPreset = this.presets.some(p => p.amount === this.amount)
            if (!matchesPreset) return this.formatAmount(this.amount)
            return 'Custom'
        },
    },
    methods: {
        roundToStep(val) {
            return Math.round(val / this.step) * this.step
        },
        selectPreset(preset) {
            this.amount = preset.amount
        },
        toggleCustom() {
            this.customValue = String(this.amount)
            this.editingCustom = true
            this.$nextTick(() => {
                if (this.$refs.customInput) {
                    this.$refs.customInput.focus()
                    this.$refs.customInput.select()
                }
            })
        },
        finishCustom() {
            let value = parseInt(this.customValue, 10)
            if (isNaN(value)) value = this.minBet
            value = Math.max(this.minBet, Math.min(this.maxBet, value))
            value = this.roundToStep(value)
            value = Math.max(this.minBet, Math.min(this.maxBet, value))
            this.amount = value
            this.editingCustom = false
        },
        cancelCustom() {
            this.editingCustom = false
        },
    },
}
</script>

<style lang="scss" scoped>
@import '../../../variables';

.bet-chips {
    display: flex;
    flex-direction: column;
    gap: $spacing-small;
}

.presets {
    display: flex;
    gap: $spacing-small;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding: 2px 0;

    &::-webkit-scrollbar {
        display: none;
    }
}

.chip-pill {
    flex: 0 0 auto;
    padding: 2px 8px;
    border-radius: 999px;
    font-size: 0.8em;
    font-weight: bold;
    white-space: nowrap;
    background: $gray;
    color: $text-color;
    border: 1px solid $border-color;
    cursor: pointer;
    transition: all $transition-fast;

    &:hover, &.active {
        background: $primary;
        color: white;
        border-color: $primary;
    }

    &.custom {
        min-width: 60px;
        text-align: center;
    }
}

.custom-input {
    width: 50px;
    text-align: center;
    font-size: inherit;
    font-weight: inherit;
    padding: 0;
    border: none;
    background: transparent;
    color: inherit;
    outline: none;
}

.bet-actions {
    display: flex;
    gap: $spacing-small;
    justify-content: flex-end;
}
</style>
