<template>
    <form class="game-selector-texas-hold-em" @submit.prevent="submit">
        <h4>Texas Hold'Em</h4>

        <fancy-input label="Ante" type="number" :min="0" :max="50" :step="25" v-model="ante" unit="¢"/>

        <fancy-select label="Blinds" v-model="blinds" :options="[
            [ '0-0', '0¢/0¢' ],
            [ '25-25', '25¢/25¢' ],
            [ '25-50', '25¢/50¢' ],
            [ '50-100', '50¢/$1' ],
        ]"/>

        <fancy-select label="Variant"
                      v-model="variant"
                      :options="[
                              [ 'standard', 'Standard' ],
                              [ 'lazy-pineapple', 'Lazy Pineapple' ],
            ]"/>

        <div class="buttons">
            <button type="submit">Start</button>
        </div>
    </form>
</template>

<script>
import FancyInput from "@/components/formelements/FancyInput"
import FancySelect from "@/components/formelements/FancySelect"

export default {
    name: "GameSelectorTexasHoldEm",
    components: {FancySelect, FancyInput},
    data() {
        return {
            ante: '25',
            blinds: '25-50',
            variant: 'standard',
        }
    },
    methods: {
        submit() {
            const [smallBlind, bigBlind] = this.blinds.split(/-/)
            this.$emit('submit', {
                game: 'texas-hold-em',
                opts: {
                    ante: parseInt(this.ante, 10),
                    smallBlind: parseInt(smallBlind, 10),
                    bigBlind: parseInt(bigBlind, 10),
                    variant: this.variant,
                },
            })
        },
    },
}
</script>

<style scoped>

</style>