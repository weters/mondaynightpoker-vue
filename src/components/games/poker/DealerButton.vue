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
    $font-size:       12px;
    align-items:      center;
    background-color: rgb(223, 235, 230);
    border-radius:    $size;
    border:           2px solid #0004;
    box-shadow:       2px 1px 0 rgba(black, 0.2);
    color:            #0008;
    display:          flex;
    font-size:        $font-size;
    font-weight:      bold;
    height:           $size;
    justify-content:  center;
    width:            $size;
}
</style>