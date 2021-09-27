<template>
    <form class="game-selector-acey-deucey" @submit.prevent="submit">
        <h4>Acey Deucey</h4>

        <fancy-input label="Ante" type="number" :min="25" :max="100" :step="25" v-model="ante" unit="¢" />

        <div class="options">
            <fancy-select label="Edition"
                          v-model="gameType"
                          :options="[
            [ 'standard', 'Standard' ],
            [ 'continuous shoe', 'Continuous Shoe' ],
            [ 'chaos', 'Chaos' ],
        ]" />
        </div>

        <div class="buttons">
            <button>Start</button>
        </div>
    </form>
</template>

<script>
import FancyInput from "@/components/formelements/FancyInput"
import FancySelect from "@/components/formelements/FancySelect"

export default {
    name: "GameSelectorAceyDeucey",
    components: {FancySelect, FancyInput},
    data() {
        return {
            ante: '25',
            allowPass: false,
            gameType: 'continuous shoe',
        }
    },
    methods: {
        submit() {
            this.$emit('submit', {
                game: 'acey-deucey',
                opts: {
                    ante: parseInt(this.ante, 10),
                    gameType: this.gameType,
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