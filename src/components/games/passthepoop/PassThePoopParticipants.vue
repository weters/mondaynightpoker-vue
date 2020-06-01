<template>
    <transition-group name="participant" tag="div" class="ptp-participants">
        <pass-the-poop-participant
                v-for="p in participants"
                :participant="p"
                :player-data="playerDataById(p.playerId)"
                :key="p.playerId"
        />
    </transition-group>
</template>

<script>
    import PassThePoopParticipant from "./PassThePoopParticipant"

    export default {
        name: "PassThePoopParticipants",
        components: {PassThePoopParticipant},
        props: {
            participants: {
                type: Array,
                required: true,
            },
        },
        methods: {
            playerDataById(id) {
                return this.$store.getters.playerDataById(id)
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../../variables.scss';

    div.ptp-participants {
        $margin:         calc(#{$spacing} / -2);
        display:         flex;
        flex-flow:       row wrap;
        margin:          $margin;
        justify-content: center;

        & > * {
            margin: calc(#{$spacing} / 2);
            flex:   0 0 calc(25% - #{$spacing});
        }
    }

    .participant-move {
        transition: transform 1s;
    }

    .participant-leave-active {
        transition: all 500ms;
    }

    .participant-leave-to {
        transform: translateY(-100%);
        opacity: 0;
    }
</style>