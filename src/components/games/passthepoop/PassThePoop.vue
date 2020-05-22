<template>
    <div class="pass-the-poop">
        {{ game }}

        <player-bar />
    </div>
</template>

<script>
    import {mapState} from "vuex"
    import PlayerBar from "../PlayerBar"

    export default {
        name: "PassThePoop",
        components: {PlayerBar},
        computed: {
            ...mapState(['game'])
        }
    }
</script>

<style scoped>

</style>