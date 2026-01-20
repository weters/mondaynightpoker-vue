<template>
    <form class="bourre inner hide-required" @submit.prevent="submit">
        <h4>Bourré</h4>

        <fancy-input label="Ante" type="number" :min="25" :max="200" :step="25" v-model="ante" unit="¢" />

        <toggle label="Five Suits" v-model="fiveSuit" />

        <div class="buttons">
            <button>Start</button>
        </div>
    </form>
</template>

<script>
import FancyInput from "@/components/formelements/FancyInput.vue"
import Toggle from "@/components/formelements/Toggle.vue"

export default {
    name: "GameSelectorBourre",
    components: {Toggle, FancyInput},
    data() {
        return {
            ante: '50',
            fiveSuit: false,
        }
    },
    methods: {
        submit() {
            this.$emit('submit', {
                game: 'bourre',
                opts: {
                    ante: parseInt(this.ante, 10),
                    fiveSuit: this.fiveSuit,
                },
            })
        },
    },
}
</script>

<style scoped>

</style>