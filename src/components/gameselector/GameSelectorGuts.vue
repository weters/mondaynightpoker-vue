<template>
    <form class="guts inner hide-required" @submit.prevent="submit">
        <h4>Guts</h4>

        <fancy-input label="Ante" type="number" :min="25" :max="200" :step="25" v-model="ante" unit="¢" />
        <fancy-input label="Max Owed" type="number" :min="5" :max="25" :step="1" v-model="maxOwed" unit="$" />
        <fancy-select label="Variant" v-model="cardCount" :options="cardCountOptions" />
        <toggle label="Bloody Guts" v-model="bloodyGuts" />
        <toggle label="Allow Trades" v-model="allowTrades" />

        <div class="buttons">
            <button>Start</button>
        </div>
    </form>
</template>

<script>
import FancyInput from "@/components/formelements/FancyInput.vue"
import FancySelect from "@/components/formelements/FancySelect.vue"
import Toggle from "@/components/formelements/Toggle.vue"

export default {
    name: "GameSelectorGuts",
    components: {FancyInput, FancySelect, Toggle},
    data() {
        return {
            cardCount: '3',
            ante: '50',
            maxOwed: '10',
            bloodyGuts: true,
            allowTrades: true,
            cardCountOptions: [
                ['2', '2-Card'],
                ['3', '3-Card'],
            ],
        }
    },
    methods: {
        submit() {
            this.$emit('submit', {
                game: 'guts',
                opts: {
                    cardCount: parseInt(this.cardCount, 10),
                    ante: parseInt(this.ante, 10),
                    maxOwed: parseInt(this.maxOwed, 10) * 100,
                    bloodyGuts: this.bloodyGuts,
                    allowTrades: this.allowTrades,
                },
            })
        },
    },
}
</script>

<style scoped>

</style>
