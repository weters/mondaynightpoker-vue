<template>
  <div class="dealer-button">
    <span>D</span>
  </div>
</template>

<script>
export default {
    name: "DealerButton",
}
</script>

<style lang="scss" scoped>
.dealer-button {
    $size:            22px;

    align-items:      center;
    justify-content:  center;
    display:          flex;

    width:            $size;
    height:           $size;
    border-radius:    $radius-pill;

    // ivory playing-card disc that reads on the felt
    background:       radial-gradient(120% 120% at 30% 25%, #FFFFFF 0%, $card-face 55%, $card-face-edge 100%);
    border:           1px solid $card-face-edge;
    box-shadow:       $shadow-card-rest;

    color:            $suit-black;
    font-family:      $font-text;
    font-size:        $fs-2xs;
    font-weight:      $fw-bold;
    letter-spacing:   $tracking-tight;
    line-height:      1;
}
</style>