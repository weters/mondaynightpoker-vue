<template>
    <form class="game-selector-texas-hold-em" @submit.prevent="submit">
        <h4>Limit Texas Hold'Em</h4>

        <fancy-input label="Ante" type="number" :min="0" :max="50" :step="25" v-model="ante" unit="¢" />

        <fancy-select label="Limits" v-model="lowLimit" :options="[
            [ '25', '25¢/50¢' ],
            [ '50', '50¢/$1' ],
            [ '100', '$1/$2' ],
        ]" />

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
            lowLimit: '50',
        }
    },
    methods: {
        submit() {
            this.$emit('submit', {
                game: 'texas-hold-em',
                opts: {
                    ante: parseInt(this.ante, 10),
                    lowLimit: parseInt(this.lowLimit, 10),
                }
            })
        },
    },
}
</script>

<style scoped>

</style>