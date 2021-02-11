<template>
    <span :class="{ 'player-status': true, connected, seated }"></span>
</template>

<script>
export default {
    name: "PlayerStatus",
    props: {
        connected: Boolean,
        seated: Boolean,
    },
}
</script>

<style lang="scss" scoped>
@import '../variables.scss';

$size: 12px;
$dot-size: $size - 4px;
span.player-status {
    display:          inline-block;
    width:            $size;
    height:           $size;
    border-radius:    $size;
    background-color: transparent;
    border:           1px solid $dark-green;
    position: relative;

    &:not(.connected) {
        border-color: $border-color;
    }

    &::after {
        width: $dot-size;
        height: $dot-size;
        border-radius: $dot-size;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        content: '';
        display: block;
    }

    &.seated::after {
        background-color: $orange;
    }

    &.connected.seated::after {
        background-color: $green;
    }
}
</style>