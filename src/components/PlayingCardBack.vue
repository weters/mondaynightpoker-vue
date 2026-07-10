<template>
  <div class="playing-card-back">
    <img
      src="/images/poker/card-back.png"
      srcset="/images/poker/card-back@2x.png 2x, /images/poker/card-back@3x.png 3x"
      alt=""
    >
  </div>
</template>

<script>
export default {
    name: "PlayingCardBack",
}
</script>

<style lang="scss" scoped>
div.playing-card-back {
    border-radius: $radius-card;
    position:      relative;
    overflow:      hidden;
    border:        0.99px solid $card-face-edge;
    box-shadow:    inset 0 1px 3px rgba(#000, 0.06),
                   inset 0 -1px 2px rgba(#fff, 0.8),
                   $shadow-card-rest;

    img {
        display:       block;
        width:         100%;
        height:        100%;
        object-fit:    cover;
        border-radius: $radius-card;
    }
}
</style>
