<template>
    <div class="acey-deucey-pot">
        <chip-stack :amount="pot"/>
    </div>
</template>

<script>
import ChipStack from "@/components/ChipStack"

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
}
</style>