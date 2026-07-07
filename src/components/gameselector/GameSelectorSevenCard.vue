<template>
  <form
    class="seven-card inner hide-required"
    @submit.prevent="submit"
  >
    <h4>Seven Card</h4>

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
      v-model="variant"
      label="Variant"
      :options="[
        [ 'stud', 'Seven-Card Stud' ],
        [ 'low-card-wild', 'Low Card Wild' ],
        [ 'baseball', 'Baseball' ],
        [ 'follow-the-queen', 'Follow the Queen' ],
        [ 'high-chicago', 'High Chicago' ],
        [ 'chiggs', '7 Card Chiggs' ],
        [ 'coupons-and-clippings', 'Coupons and Clippings' ],
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
    name: "GameSelectorSevenCard",
    components: {FancySelect, FancyInput},
    inheritAttrs: false,
    emits: ['submit'],
    data() {
        return {
            ante: '25',
            variant: 'stud',
        }
    },
    methods: {
        submit() {
            this.$emit('submit', {
                game: 'seven-card',
                opts: {
                    ante: parseInt(this.ante, 10),
                    variant: this.variant,
                },
            })
        },
    },
}
</script>

<style scoped>

</style>