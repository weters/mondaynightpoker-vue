<template>
    <div class="playing-card-back">
        <img src="/images/poker/card-back.png"
             srcset="/images/poker/card-back@2x.png 2x, /images/poker/card-back@3x.png 3x"
             alt=""/>
    </div>
</template>

<script>
export default {
    name: "PlayingCardBack",
}
</script>

<style lang="scss" scoped>
div.playing-card-back {
    border-radius: $border-radius-card;
    position:      relative;
    overflow:      hidden;
    border:        0.99px solid #d0c8b8;
    box-shadow:    inset 0 1px 3px rgba(0, 0, 0, 0.06),
                   inset 0 -1px 2px rgba(255, 255, 255, 0.8),
                   0 2px 6px rgba(0, 0, 0, 0.1);

    img {
        display:       block;
        width:         100%;
        height:        100%;
        object-fit:    cover;
        border-radius: $border-radius-card;
    }
}
</style>
