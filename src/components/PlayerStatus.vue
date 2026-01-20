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

$size: 10px;
span.player-status {
    display:          inline-block;
    width:            $size;
    height:           $size;
    border-radius:    $size;
    background-color: $border-color;
    flex-shrink: 0;
    transition: all $transition-fast;

    &.connected {
        background-color: $text-color-light;
    }

    &.seated {
        background-color: $orange;
        box-shadow: 0 0 0 2px rgba($orange, 0.2);
    }

    &.connected.seated {
        background-color: $light-green;
        box-shadow: 0 0 0 2px rgba($light-green, 0.2);
    }
}
</style>