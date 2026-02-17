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
        display: flex;
        gap: 2px;

        span.trick {
            width: 8px;
            height: 8px;
            min-width: 5px;
            min-height: 5px;
            flex-shrink: 1;
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 50%;

            &.won {
                background-color: $light-green;
            }
        }
    }
</style>