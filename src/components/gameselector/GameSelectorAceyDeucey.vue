<template>
    <form class="inner hide-required" @submit.prevent="submit">
        <h4>Acey Deucey</h4>

        <fancy-input label="Ante" type="number" :min="25" :max="100" :step="25" v-model="ante" unit="¢" />

        <div class="options">
            <toggle v-model="allowPass" label="Allow Passing" />
            <toggle v-model="continuousShoe" label="Continuous Shoe" />
        </div>

        <div class="buttons">
            <button>Start</button>
        </div>
    </form>
</template>

<script>
import Toggle from "@/components/Toggle"
import FancyInput from "@/components/FancyInput"

export default {
    name: "GameSelectorAceyDeucey",
    components: {FancyInput, Toggle},
    data() {
        return {
            ante: '25',
            continuousShoe: false,
            allowPass: false,
        }
    },
    methods: {
        submit() {
            this.$emit('submit', {
                game: 'acey-deucey',
                opts: {
                    ante: parseInt(this.ante, 10),
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