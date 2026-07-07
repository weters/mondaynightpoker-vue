<template>
    <span :class="{yes: value}"></span>
</template>

<script>
    export default {
        name: "Boolean",
        props: {
            value: {
                type: Boolean,
                required: true,
            }
        },
    }
</script>

<style lang="scss" scoped>
    span {
        $size: 16px;
        display: inline-block;
        width: $size;
        height: $size;
        background-color: $red;
        border-radius: calc( #{$size} / 2 );
        vertical-align: middle;

        &.yes {
            background-color: $primary;
        }
    }
</style>