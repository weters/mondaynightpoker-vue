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
        display:   flex;
        flex-wrap: wrap;
        margin:    -1 * $spacing-medium 0 0 -1 * $spacing-medium;
        justify-content: center;

        & > * {
            flex:      1 0 150px;

            max-width: 300px;
            margin:    $spacing-medium 0 0 $spacing-medium;
        }
    }
}
</style>