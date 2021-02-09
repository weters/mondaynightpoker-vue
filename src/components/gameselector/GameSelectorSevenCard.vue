<template>
    <form class="seven-card inner hide-required" @submit.prevent="submit">
        <h4>Seven Card</h4>

        <game-selector-ante :min="25" :max="400" v-model="ante"/>

        <label class="variant">
            <span>Variant</span>
            <select v-model="variant">
                <option value="stud">Seven-Card Stud</option>
                <option value="low-card-wild">Low Card Wild</option>
                <option value="baseball">Baseball</option>
                <option value="follow-the-queen">Follow the Queen</option>
            </select>
        </label>

        <div class="buttons">
            <button>Start</button>
        </div>
    </form>
</template>

<script>
import GameSelectorAnte from "@/components/gameselector/GameSelectorAnte"

export default {
    name: "GameSelectorSevenCard",
    components: {GameSelectorAnte},
    data() {
        return {
            ante: 25,
            variant: 'stud',
        }
    },
    methods: {
        submit() {
            this.$emit('submit', {
                game: 'seven-card',
                opts: {
                    ante: this.ante,
                    variant: this.variant,
                },
            })
        },
    },
}
</script>

<style scoped>

</style>