<template>
  <chip-stack :amount="gameState.pot" />
</template>

<script>
    import balance from "@/mixins/balance"
    import {mapState} from "pinia"
    import {useBourreStore} from "@/store/bourre"
    import ChipStack from "../../ChipStack.vue"

    export default {
        name: "BourrePot",
        components: {ChipStack},
        mixins: [balance],
        computed: {
            ...mapState(useBourreStore, ['gameState']),
        },
    }
</script>

<style lang="scss" scoped>
    :deep(.amount) {
        @include numeric;
        font-size:   $fs-xl;
        font-weight: $fw-bold;
        color:       $gold-soft;
        text-shadow: 0 0 12px rgba($gold, 0.4);
    }
</style>