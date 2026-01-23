<template>
    <form class="guts inner hide-required" @submit.prevent="submit">
        <h4>2-Card Guts</h4>

        <fancy-input label="Ante" type="number" :min="25" :max="200" :step="25" v-model="ante" unit="¢" />
        <fancy-input label="Max Owed" type="number" :min="5" :max="25" :step="1" v-model="maxOwed" unit="$" />

        <div class="buttons">
            <button>Start</button>
        </div>
    </form>
</template>

<script>
import FancyInput from "@/components/formelements/FancyInput.vue"

export default {
    name: "GameSelectorGuts",
    components: {FancyInput},
    data() {
        return {
            ante: '50',
            maxOwed: '10',
        }
    },
    methods: {
        submit() {
            this.$emit('submit', {
                game: 'guts',
                opts: {
                    ante: parseInt(this.ante, 10),
                    maxOwed: parseInt(this.maxOwed, 10) * 100,
                },
            })
        },
    },
}
</script>

<style scoped>

</style>
