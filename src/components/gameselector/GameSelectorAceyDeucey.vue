<template>
  <form
    class="game-selector-acey-deucey"
    @submit.prevent="submit"
  >
    <h4>Acey Deucey</h4>

    <fancy-input
      v-model="ante"
      label="Ante"
      type="number"
      :min="25"
      :max="100"
      :step="25"
      unit="¢"
    />

    <div class="options">
      <fancy-select
        v-model="gameType"
        label="Edition"
        :options="[
          [ 'standard', 'Standard' ],
          [ 'continuous shoe', 'Continuous Shoe' ],
          [ 'chaos', 'Chaos' ],
        ]"
      />
    </div>

    <div class="buttons">
      <button>Start</button>
    </div>
  </form>
</template>

<script>
import FancyInput from "@/components/formelements/FancyInput.vue"
import FancySelect from "@/components/formelements/FancySelect.vue"

export default {
    name: "GameSelectorAceyDeucey",
    components: {FancySelect, FancyInput},
    inheritAttrs: false,
    emits: ['submit'],
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
div.buttons {
    margin: $spacing 0 0;
}
</style>