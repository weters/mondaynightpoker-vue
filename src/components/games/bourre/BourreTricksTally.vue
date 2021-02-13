<template>
    <div class="tricks">
        <span v-for="i in 5" :class="{ trick: true, won: i <= tricks }" :key="i"></span>
    </div>
</template>

<script>
    export default {
        name: "BourreTricksTally",
        props: {
            tricks: {
                type: Number,
                default: 0,
            }
        },
    }
</script>

<style lang="scss" scoped>
@import '../../../variables.scss';
    div.tricks {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        grid-gap: 2px;

        span.trick {
            width: 12px;
            height: 12px;
            background-color: $gray;
            border-radius: 12px;

            &.won {
                background-color: $green;
            }
        }
    }
</style>