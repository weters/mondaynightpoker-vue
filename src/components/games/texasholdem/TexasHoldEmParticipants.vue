<template>
    <div class="texas-hold-em-participants">
        <div class="container">
            <texas-hold-em-participant
                v-for="p in participants"
                :participant="p"
                :key="p.playerId"
            />
        </div>
    </div>
</template>

<script>
import TexasHoldEmParticipant from "@/components/games/texasholdem/TexasHoldEmParticipant"

export default {
    name: "TexasHoldEmParticipants",
    components: {TexasHoldEmParticipant},
    props: {
        participants: {
            type: Array,
            required: true,
        },
    },
}
</script>

<style lang="scss" scoped>
@import '../../../variables.scss';

div.texas-hold-em-participants {
    & > div.container {
        display: grid;
        grid-template-columns: repeat(10, 1fr);
        grid-gap: $spacing-small;

        @media(max-width: 1200px) {
            grid-template-columns: repeat(5, 1fr);
        }

        @media (max-width: 500px) {
            grid-template-columns: repeat(4, 1fr);
        }
    }
}
</style>