<template>
    <div class="little-l-pot">
        <div v-if="totalPots > 1" class="pot-details">
            <strong>
                <template v-if="index===0">Main Pot</template>
                <template v-else>Side Pot {{ index }}</template>
            </strong>

            <ul v-if="allInParticipants">
                <li v-for="(name, i) in allInParticipants" :key="i">{{ name }}</li>
            </ul>
        </div>
        <chip-stack class="llp-chip-stack" :amount="pot.amount"/>
    </div>
</template>

<script>
import ChipStack from "@/components/ChipStack"

export default {
    name: "LittleLPot",
    components: {ChipStack},
    props: {
        pot: { // amount:int, allInParticipants:[int]
            type: Object,
            required: true,
        },
        index: {
            type: Number,
            required: true,
        },
        totalPots: {
            type: Number,
            required: true,
        },
    },
    computed: {
        allInParticipants() {
            return this.pot.allInParticipants.map(id => this.$store.getters.playerDataById(id).player.displayName).sort()
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../../variables';

.little-l-pot {
    background-color: $gray;
    padding: $spacing-medium;
    border-radius: $border-radius;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-medium;

    div.pot-details {
        width: 100%;
        strong {
            font-weight: normal;
        }

        ul {
            font-size: 0.8em;
            margin: 0;
            padding: 0;
            list-style: none;
        }
    }

    .llp-chip-stack {
        margin-top: auto;
    }
}
</style>