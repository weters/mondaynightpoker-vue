<template>
<div class="cards-remaining">
    <span class="icon"><mdi-icon :icon="mdiCards" /></span>
    <span>{{ number }}</span>
</div>
</template>

<script>
import MdiIcon from "@/components/MdiIcon"
import {mdiCards} from "@mdi/js"
export default {
    name: "CardsRemaining",
    components: {MdiIcon},
    props: {
        number: {
            type: Number,
            required: true,
        }
    },
    data() {
        return {
            mdiCards,
        }
    }
}
</script>

<style lang="scss" scoped>
    div.cards-remaining {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: center;

        span {
            text-align: center;
        }

        span.icon {
            height: 26px;
            flex: 0 1 26px; /* I hate having to do this, but firefox is ignore parent sizes with flex and svg */
            svg {
                height: 100%;
                width: auto;
            }
        }
    }
</style>