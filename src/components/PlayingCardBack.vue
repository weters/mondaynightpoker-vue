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
@import '../variables.scss';

div.playing-card-back {
    border-radius: $border-radius-card;
    position:      relative;
    overflow:      hidden;
    border:        1px solid #d0c8b8;

    img {
        display:       block;
        width:         100%;
        height:        100%;
        object-fit:    cover;
        border-radius: $border-radius-card;
    }
}
</style>
