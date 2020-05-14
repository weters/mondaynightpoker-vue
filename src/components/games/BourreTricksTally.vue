<template>
    <div class="tricks">
        <mdi-icon class="icon" :icon="mdiCircleSlice8" v-for="i in tricks" :key="`won-${i}`" />
        <mdi-icon class="icon" :icon="mdiCircleOutline" v-for="i in 5 - tricks" :key="`null-${i}`" />
    </div>
</template>

<script>
    import MdiIcon from "@/components/MdiIcon"
    import {mdiCircleSlice8, mdiCircleOutline} from '@mdi/js'
    export default {
        name: "BourreTricksTally",
        components: {MdiIcon},
        props: {
            tricks: {
                type: Number,
                default: 0,
            }
        },
        data() {
            return {
                mdiCircleOutline,
                mdiCircleSlice8,
            }
        },
    }
</script>

<style lang="scss" scoped>
    div.tricks {
        display: grid;
        grid-template-columns: repeat(5, 1fr);

        .icon {
            width: 12px;

            @media (max-width: 400px) {
                width: 8px;
            }
        }
    }
</style>