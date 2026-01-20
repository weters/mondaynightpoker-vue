<template>
    <chip-stack :amount="gameState.pot"/>
</template>

<script>
    import balance from "@/mixins/balance"
    import {mapGetters} from "vuex"
    import ChipStack from "../../ChipStack.vue"

    export default {
        name: "BourrePot",
        components: {ChipStack},
        mixins: [balance],
        computed: {
            ...mapGetters({
                gameState: 'bourre/gameState',
            }),
        },
    }
</script>

<style lang="scss" scoped>
</style>