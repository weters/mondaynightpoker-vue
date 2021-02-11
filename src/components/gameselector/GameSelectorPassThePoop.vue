<template>
    <form class="pass-the-poop inner hide-required" @submit.prevent="submit">
        <h4>Pass the Poop</h4>

        <fancy-input label="Ante" type="number" :min="25" :max="400" :step="25" v-model="ante" unit="¢" />

        <fancy-select label="Edition"
                      v-model="edition"
                      :options="[
            [ 'standard', 'Standard' ],
            [ 'diarrhea', 'Diarrhea' ],
            [ 'pairs', 'Pairs' ],
        ]" />

        <fancy-select label="Lives"
                      v-model="lives"
                      :options="[
            [ '3', '3' ],
            [ '2', '2' ],
            [ '1', '1' ],
        ]" />

        <toggle label="Allow Blocks" v-model="allowBlocks" />

        <div class="buttons">
            <button>Start</button>
        </div>
    </form>
</template>

<script>
import FancyInput from "@/components/FancyInput"
import Toggle from "@/components/Toggle"
import FancySelect from "@/components/FancySelect"

export default {
    name: "GameSelectorPassThePoop",
    components: {FancySelect, Toggle, FancyInput},
    data() {
        return {
            ante: '150',
            edition: 'standard',
            lives: '2',
            allowBlocks: false,
        }
    },
    methods: {
        submit() {
            this.$emit('submit', {
                game: 'pass-the-poop',
                opts: {
                    ante: parseInt(this.ante),
                    edition: this.edition,
                    lives: parseInt(this.lives, 10),
                    allowBlocks: this.allowBlocks,
                },
            })
        },
    },
}
</script>

<style scoped>

</style>