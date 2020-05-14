<template>
    <transition-group name="player" class="bourre-players" tag="div">
        <bourre-player v-for="player in sortedPlayers" :key="player.playerId" :player="player" :player-data="playerDataById(player.playerId)" />
    </transition-group>
</template>

<script>
    import BourrePlayer from "@/components/games/BourrePlayer"
    import {mapGetters} from "vuex"
    export default {
        name: "BourrePlayers",
        components: {BourrePlayer},
        props: {
            players: {
                type: Array,
                required: true,
            }
        },
        computed: {
            ...mapGetters({
                round: 'bourre/round'
            }),
            sortedPlayers() {
                // 0 = trade-in round
                if (this.round === 0) {
                    return this.players
                }

                // round 6 is game over, so maintain previous state
                const offset = ( this.round === 6 ? 4 : this.round - 1 ) % this.players.length
                const players = [...this.players]
                const tail = players.splice(offset)
                tail.push(...players)
                return tail
            }
        },
        methods: {
            playerDataById(id) {
                return this.$store.getters.playerDataById(id)
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../variables.scss';
    div.bourre-players {
        $margin: calc(#{$spacing} / -2);
        display: flex;
        flex-flow: row wrap;
        margin: $margin;
        justify-content: center;

        & > * {
            margin: calc(#{$spacing} / 2);
            flex: 0 0 calc(50% - #{$spacing});

            @media (min-width: 1000px) {
                flex: 0 0 calc(25% - #{$spacing});
            }
        }
    }

    .player-move {
        transition: transform 1s;
    }
</style>