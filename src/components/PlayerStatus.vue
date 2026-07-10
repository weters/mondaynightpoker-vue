<template>
  <span :class="{ 'player-status': true, connected, seated }" />
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
$size: 10px;
span.player-status {
    display:          inline-block;
    width:            $size;
    height:           $size;
    border-radius:    $radius-pill;
    background-color: $hairline;
    flex-shrink: 0;
    transition: background-color $dur-fast $ease-standard, box-shadow $dur-fast $ease-standard;

    &.connected {
        background-color: $ink-muted;
    }

    &.seated {
        background-color: $accent;
        box-shadow: 0 0 0 2px rgba($orange, 0.2);
    }

    &.connected.seated {
        background-color: $positive;
        box-shadow: 0 0 0 2px rgba($positive, 0.2);
    }
}
</style>