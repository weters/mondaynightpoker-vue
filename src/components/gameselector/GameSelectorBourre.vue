<template>
    <form class="bourre inner hide-required" @submit.prevent="submit">
        <h4>Bourré</h4>

        <fancy-input label="Ante" type="number" :min="25" :max="200" :step="25" v-model="ante" unit="¢" />

        <div class="buttons">
            <button>Start</button>
        </div>
    </form>
</template>

<script>
import FancyInput from "@/components/FancyInput"

export default {
    name: "GameSelectorBourre",
    components: {FancyInput},
    data() {
        return {
            ante: '25',
        }
    },
    methods: {
        submit() {
            this.$emit('submit', {
                game: 'bourre',
                opts: {
                    ante: parseInt(this.ante, 10),
                },
            })
        },
    },
}
</script>

<style scoped>

</style>