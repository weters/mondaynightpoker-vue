<template>
    <form class="pass-the-poop inner hide-required" @submit.prevent="submit">
        <h4>Pass the Poop</h4>

        <fancy-input label="Ante" type="number" :min="25" :max="400" :step="25" v-model="ante" unit="¢" />

        <label class="edition">
            <span>Edition</span>
            <select v-model="edition">
                <option value="standard">Standard</option>
                <option value="diarrhea">Diarrhea</option>
                <option value="pairs">Pairs</option>
            </select>
        </label>

        <label class="lives">
            <span>Lives</span>
            <select v-model="lives">
                <option value="3">3</option>
                <option value="2">2</option>
                <option value="1">1</option>
            </select>
        </label>

        <toggle label="Allow Blocks" v-model="allowBlocks" />

        <div class="buttons">
            <button>Start</button>
        </div>
    </form>
</template>

<script>
import FancyInput from "@/components/FancyInput"
import Toggle from "@/components/Toggle"

export default {
    name: "GameSelectorPassThePoop",
    components: {Toggle, FancyInput},
    data() {
        return {
            ante: '150',
            edition: 'standard',
            lives: '3',
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