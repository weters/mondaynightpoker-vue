<template>
  <form
    class="pass-the-poop inner hide-required"
    @submit.prevent="submit"
  >
    <h4>Pass the Poop</h4>

    <fancy-input
      v-model="ante"
      label="Ante"
      type="number"
      :min="25"
      :max="400"
      :step="25"
      unit="¢"
    />

    <fancy-select
      v-model="edition"
      label="Edition"
      :options="[
        [ 'standard', 'Standard' ],
        [ 'diarrhea', 'Diarrhea' ],
        [ 'pairs', 'Pairs' ],
      ]"
    />

    <fancy-select
      v-model="lives"
      label="Lives"
      :options="[
        [ '3', '3' ],
        [ '2', '2' ],
        [ '1', '1' ],
      ]"
    />

    <toggle
      v-model="allowBlocks"
      label="Allow Blocks"
    />

    <div class="buttons">
      <button>Start</button>
    </div>
  </form>
</template>

<script>
import FancyInput from "@/components/formelements/FancyInput.vue"
import Toggle from "@/components/formelements/Toggle.vue"
import FancySelect from "@/components/formelements/FancySelect.vue"

export default {
    name: "GameSelectorPassThePoop",
    components: {FancySelect, Toggle, FancyInput},
    inheritAttrs: false,
    emits: ['submit'],
    data() {
        return {
            ante: '150',
            edition: 'pairs',
            lives: '2',
            allowBlocks: false,
        }
    },
    methods: {
        submit() {
            this.$emit('submit', {
                game: 'pass-the-poop',
                opts: {
                    ante: parseInt(this.ante),
                    edition: this.edition,
                    lives: parseInt(this.lives, 10),
                    allowBlocks: this.allowBlocks,
                },
            })
        },
    },
}
</script>

<style scoped>

</style>