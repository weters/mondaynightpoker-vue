<template>
  <div class="tricks">
    <span
      v-for="i in 5"
      :key="i"
      :class="{ trick: true, won: i <= tricks }"
    />
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
    div.tricks {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        grid-gap: 2px;

        span.trick {
            width:            12px;
            height:           12px;
            background-color: rgba(#fff, 0.14);
            border-radius:    $radius-pill;
            transition:       background-color $dur-fast $ease-standard;

            &.won {
                background-color: $positive;
            }
        }
    }
</style>