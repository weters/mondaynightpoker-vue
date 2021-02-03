<template>
    <form class="inner" @submit.prevent="submit">
        <h4>Acey Deucey</h4>

        <game-selector-ante :min="25" :max="100" :value="ante"/>

        <div class="buttons">
            <button>Start</button>
        </div>
    </form>
</template>

<script>
import GameSelectorAnte from "@/components/gameselector/GameSelectorAnte"

export default {
    name: "GameSelectorAceyDeucey",
    components: {GameSelectorAnte},
    data() {
        return {
            ante: 25,
        }
    },
    methods: {
        submit() {
            this.$emit('submit', {
                game: 'acey-deucey',
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