<template>
    <chip-stack :amount="gameState.pot"/>
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
</style>