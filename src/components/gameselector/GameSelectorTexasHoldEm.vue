<template>
  <form
    class="game-selector-texas-hold-em"
    @submit.prevent="submit"
  >
    <h4>Texas Hold'Em</h4>

    <fancy-input
      v-model="ante"
      label="Ante"
      type="number"
      :min="0"
      :max="50"
      :step="25"
      unit="¢"
    />

    <fancy-select
      v-model="blinds"
      label="Blinds"
      :options="[
        [ '0-0', '0¢/0¢' ],
        [ '25-25', '25¢/25¢' ],
        [ '25-50', '25¢/50¢' ],
        [ '50-100', '50¢/$1' ],
      ]"
    />

    <fancy-select
      v-model="variant"
      label="Variant"
      :options="[
        [ 'standard', 'Standard' ],
        [ 'pineapple', 'Pineapple' ],
        [ 'lazy-pineapple', 'Lazy Pineapple' ],
      ]"
    />

    <div class="buttons">
      <button>Start</button>
    </div>
  </form>
</template>

<script>
import FancyInput from "@/components/formelements/FancyInput.vue"
import FancySelect from "@/components/formelements/FancySelect.vue"

export default {
    name: "GameSelectorTexasHoldEm",
    components: {FancySelect, FancyInput},
    inheritAttrs: false,
    emits: ['submit'],
    data() {
        return {
            ante: '25',
            blinds: '25-50',
            variant: 'standard',
        }
    },
    methods: {
        submit() {
            const [smallBlind, bigBlind] = this.blinds.split(/-/)
            this.$emit('submit', {
                game: 'texas-hold-em',
                opts: {
                    ante: parseInt(this.ante, 10),
                    smallBlind: parseInt(smallBlind, 10),
                    bigBlind: parseInt(bigBlind, 10),
                    variant: this.variant,
                },
            })
        },
    },
}
</script>

<style scoped>

</style>