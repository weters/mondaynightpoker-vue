<template>
    <form class="little-l inner hide-required" @submit.prevent="submit">
        <h4>Little L</h4>

        <fancy-input label="Ante" type="number" :min="25" :max="200" :step="25" v-model="ante" unit="¢" />

        <div class="initial-deal">
            <span>Initial deal</span>

            <radio-button v-model="initialDeal" value="3" label="3" />
            <radio-button v-model="initialDeal" value="4" label="4" />
        </div>

        <div class="trade-ins">
            <span>Trade-ins</span>

            <toggle v-for="i in 5"
                    :label="`${i - 1}`"
                    :key="i"
                    :value="`${i-1}`"
                    v-model="tradeIns"
                    :disabled="i - 1 > parseInt(initialDeal, 10)"
                    />
        </div>

        <div class="buttons">
            <button>Start</button>
        </div>
    </form>
</template>

<script>
import FancyInput from "@/components/FancyInput"
import Toggle from "@/components/Toggle"
import RadioButton from "@/components/RadioButton"

export default {
    name: "GameSelectorLittleL",
    components: {RadioButton, Toggle, FancyInput},
    data() {
        return {
            ante: '25',
            tradeIns: ['0', '2'],
            initialDeal: '4',
        }
    },
    methods: {
        submit() {
            this.$emit('submit', {
                game: 'little-l',
                opts: {
                    ante: parseInt(this.ante, 10),
                    tradeIns: this.tradeIns.map(v => parseInt(v, 10)),
                    initialDeal: parseInt(this.initialDeal, 10),
                },
            })
        },
    },
}
</script>

<style lang="scss" scoped>
@import '../../variables.scss';

form.little-l {
    .toggle {
        margin-bottom: $spacing-medium;
    }
    .trade-ins {
        margin-top: $spacing-medium;
    }

    .radio-button:not(:last-child) {
        margin-bottom: $spacing-medium;
    }
}
</style>