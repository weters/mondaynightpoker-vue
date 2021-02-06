<template>
    <form class="inner" @submit.prevent="submit">
        <h4>Acey Deucey</h4>

        <game-selector-ante :min="25" :max="100" :value="ante"/>

        <div class="options">
            <label class="optional checkbox">
                <input type="checkbox" v-model="allowPass" />
                <span>Allow Passing</span>
            </label>

            <label class="optional checkbox">
                <input type="checkbox" v-model="continuousShoe" />
                <span>Chaos Mode (Continuous Shoe)</span>
            </label>
        </div>

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
            continuousShoe: false,
            allowPass: false,
        }
    },
    methods: {
        submit() {
            this.$emit('submit', {
                game: 'acey-deucey',
                opts: {
                    ante: this.ante,
                    continuousShoe: this.continuousShoe,
                    allowPass: this.allowPass,
                },
            })
        },
    },
}
</script>

<style lang="scss" scoped>
@import '../../variables.scss';

div.buttons {
    margin: $spacing 0 0;
}
</style>