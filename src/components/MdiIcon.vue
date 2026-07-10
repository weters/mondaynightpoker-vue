<template>
  <svg
    class="mdi-icon"
    viewBox="0 0 24 24"
  >
    <path :d="icon" />
  </svg>
</template>

<script>
    export default {
        name: "MdiIcon",
        props: {
            icon: {
                type: String,
                required: true,
            }
        }
    }
</script>

<style scoped>
.mdi-icon {
    /* default fallback so any un-styled icon inherits ambient text/token
       color instead of the SVG default (black); more specific fill rules
       set by consuming components still win. */
    fill: currentColor;
}
</style>