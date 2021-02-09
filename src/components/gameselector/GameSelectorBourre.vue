<template>
    <form class="bourre inner hide-required" @submit.prevent="submit">
        <h4>Bourré</h4>

        <game-selector-ante :min="25" :max="200" :step="25" v-model="ante"/>

        <div class="buttons">
            <button>Start</button>
        </div>
    </form>
</template>

<script>
import GameSelectorAnte from "@/components/gameselector/GameSelectorAnte"

export default {
    name: "GameSelectorBourre",
    components: {GameSelectorAnte},
    data() {
        return {
            ante: 25,
        }
    },
    methods: {
        submit() {
            this.$emit('submit', {
                game: 'bourre',
                opts: {
                    ante: this.ante,
                },
            })
        },
    },
}
</script>

<style scoped>

</style>