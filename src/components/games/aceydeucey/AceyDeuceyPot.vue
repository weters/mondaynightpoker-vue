<template>
  <div class="acey-deucey-pot">
    <chip-stack :amount="pot" />
  </div>
</template>

<script>
import ChipStack from "@/components/ChipStack.vue"

export default {
    name: "AceyDeuceyPot",
    components: {ChipStack},
    props: {
        pot: {
            type: Number,
            required: true,
        },
    },
}
</script>

<style lang="scss" scoped>
.acey-deucey-pot {
    display: flex;
    flex-direction: column;
    align-items: center;

    :deep(.amount) {
        @include numeric;
        font-size:   $fs-xl;
        font-weight: $fw-bold;
        color:       $gold-soft;
        text-shadow: 0 0 12px rgba($gold, 0.4);
    }
}
</style>