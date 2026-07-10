<template>
  <div class="bet-chips">
    <div class="presets">
      <button
        v-for="preset in presets"
        :key="preset.label"
        :class="{ 'chip-pill': true, active: amount === preset.amount }"
        @click="selectPreset(preset)"
      >
        {{ preset.label }}
      </button>
    </div>

    <div class="slider-row">
      <button
        class="stepper"
        type="button"
        @click="nudge(-1)"
      >
        &minus;
      </button>
      <div class="slider-wrap">
        <input
          type="range"
          class="bet-slider"
          :min="minBet"
          :max="sliderMax"
          :step="step"
          :value="amount"
          @input="onSlider"
        >
      </div>
      <button
        class="stepper"
        type="button"
        @click="nudge(1)"
      >
        +
      </button>
    </div>

    <div class="bet-actions">
      <button
        class="secondary"
        type="button"
        @click="$emit('cancel')"
      >
        Cancel
      </button>
      <button
        type="button"
        @click="$emit('submit', effectiveAmount)"
      >
        {{ submitLabel }}
      </button>
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
        allInLabel: {
            type: String,
            default: 'All-in',
        },
    },
    emits: ['submit', 'cancel'],
    data() {
        return {
            amount: this.minBet,
        }
    },
    computed: {
        isAllIn() {
            return this.allInAmount <= this.maxBet
        },
        sliderMax() {
            return Math.min(this.maxBet, this.allInAmount)
        },
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

            const maxAmount = Math.min(allInAmount, maxBet)
            if (maxAmount > minBet) {
                const label = allInAmount <= maxBet ? this.allInLabel : 'Max'
                list.push({label, amount: maxAmount})
            }

            return list
        },
        effectiveAmount() {
            return Math.min(this.amount, this.maxBet, this.allInAmount)
        },
        submitLabel() {
            if (this.effectiveAmount >= this.allInAmount) return `${this.allInLabel} ${this.formatAmount(this.allInAmount)}`
            return `${this.actionName} ${this.formatAmount(this.effectiveAmount)}`
        },
    },
    methods: {
        roundToStep(val) {
            return Math.round(val / this.step) * this.step
        },
        selectPreset(preset) {
            this.amount = preset.amount
        },
        onSlider(e) {
            this.amount = parseInt(e.target.value, 10)
        },
        nudge(direction) {
            const next = this.amount + direction * this.step
            this.amount = Math.max(this.minBet, Math.min(this.sliderMax, next))
        },
    },
}
</script>

<style lang="scss" scoped>
.bet-chips {
    display:        flex;
    flex-direction: column;
    gap:            $space-2;
}

// Quick preset chips — horizontal scroll on narrow phones.
.presets {
    display:                    flex;
    gap:                        $space-1;
    overflow-x:                 auto;
    -webkit-overflow-scrolling: touch;
    padding:                    2px 0;

    &::-webkit-scrollbar {
        display: none;
    }
}

.chip-pill {
    @include tap-target;
    flex:           0 0 auto;
    padding:        $space-1 $space-3;
    border-radius:  $radius-pill;
    font-family:    $font-text;
    font-size:      $fs-sm;
    font-weight:    $fw-semibold;
    white-space:    nowrap;
    background:     $felt-rail;
    color:          $on-felt;
    border:         1px solid $felt-hairline;
    cursor:         pointer;
    transition:     background $dur-fast $ease-standard,
                    color $dur-fast $ease-standard,
                    border-color $dur-fast $ease-standard;

    &:hover {
        border-color: rgba($accent, 0.6);
    }

    &.active {
        background:    $accent;
        color:        $accent-ink;
        border-color: $accent;
    }

    &:focus-visible {
        @include focus-ring-on-felt;
    }
}

.slider-row {
    display:     flex;
    align-items: center;
    gap:         $space-2;
}

.stepper {
    @include tap-target;
    flex:            0 0 auto;
    width:           44px;
    height:          44px;
    padding:         0;
    border-radius:   $radius-pill;
    font-size:       $fs-lg;
    font-weight:     $fw-bold;
    line-height:     1;
    background:      $felt-rail;
    color:           $on-felt;
    border:          1px solid $felt-hairline;
    cursor:          pointer;
    display:         flex;
    align-items:     center;
    justify-content: center;
    transition:      background $dur-fast $ease-standard,
                     border-color $dur-fast $ease-standard;

    &:hover {
        border-color: rgba($accent, 0.6);
    }

    &:active {
        background:    $accent;
        color:        $accent-ink;
        border-color: $accent;
    }

    &:focus-visible {
        @include focus-ring-on-felt;
    }
}

.slider-wrap {
    flex:      1;
    min-width: 0;
}

.bet-slider {
    width:      100%;
    height:     44px;
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    cursor:     pointer;

    &::-webkit-slider-runnable-track {
        height:        6px;
        border-radius: $radius-pill;
        background:    rgba($accent, 0.3);
    }

    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance:    none;
        width:         22px;
        height:        22px;
        border-radius: 50%;
        background:    $accent;
        border:        2px solid $card-face;
        box-shadow:    $shadow-felt-sm;
        margin-top:    -8px;
    }

    &::-moz-range-track {
        height:        6px;
        border-radius: $radius-pill;
        background:    rgba($accent, 0.3);
        border:        none;
    }

    &::-moz-range-thumb {
        width:         22px;
        height:        22px;
        border-radius: 50%;
        background:    $accent;
        border:        2px solid $card-face;
        box-shadow:    $shadow-felt-sm;
    }

    &:focus-visible {
        &::-webkit-slider-thumb { box-shadow: $glow-turn; }
        &::-moz-range-thumb     { box-shadow: $glow-turn; }
    }
}

.bet-actions {
    display:         flex;
    gap:             $space-2;
    justify-content: flex-end;
}
</style>
