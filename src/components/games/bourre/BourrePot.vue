<template>
    <div class="bourre-pot">
        <strong>{{ formatAmount(gameState.pot) }}</strong>
    </div>
</template>

<script>
    import balance from "@/mixins/balance"
    import {mapGetters} from "vuex"

    export default {
        name: "BourrePot",
        mixins: [balance],
        computed: {
            ...mapGetters({
                gameState: 'bourre/gameState',
            }),
        }
    }
</script>

<style scoped>

</style>