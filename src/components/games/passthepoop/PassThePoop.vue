<template>
    <div class="pass-the-poop">
        <pass-the-poop-participants :participants="participants"/>

        <player-bar>
            <div class="bar">
                <div class="card">
                    <playing-card :rank="card.rank" :suit="card.suit"/>
                </div>
                <div class="buttons">
                    <template v-if="isPlayerTurn">
                        <template v-if="confirmStay">
                            <button class="secondary" @click="confirmStay=false">Cancel</button>
                            <button>Yes, Stay</button>
                        </template>
                        <template v-else-if="confirmTrade">
                            <button class="secondary" @click="confirmTrade=false">Cancel</button>
                            <button>Yes, Trade</button>
                        </template>
                        <template v-else>
                            <button @click="confirmStay=true">Stay</button>
                            <button @click="confirmTrade=true">Trade</button>
                        </template>
                    </template>
                </div>
            </div>

            <template v-slot:gameInfo>
            <span class="turn">
                <strong>Turn:</strong>
                <span>{{ currentTurn }}</span>
            </span>
            </template>
        </player-bar>
    </div>
</template>

<script>
    import {mapGetters, mapState} from "vuex"
    import PlayerBar from "../PlayerBar"
    import PlayingCard from "../../PlayingCard"
    import PassThePoopParticipants from "./PassThePoopParticipants"

    export default {
        name: "PassThePoop",
        components: {PassThePoopParticipants, PlayingCard, PlayerBar},
        data() {
            return {
                confirmStay: false,
                confirmTrade: false,
            }
        },
        computed: {
            ...mapState(['game']),
            ...mapGetters({
                card: 'passThePoop/card',
                gameData: 'passThePoop/gameData',
            }),
            currentTurn() {
                return this.$store.getters.playerDataById(this.gameData.gameState.currentTurn).player.displayName
            },
            participants() {
                return this.gameData.gameState.participants.map(p => {
                    p.playerData = this.$store.getters.playerDataById(p.playerId)
                    return p
                })
            },
        },
        methods: {
            isPlayerTurn(id) {
                return this.$store.getters['passThePoop/isPlayerTurn'](id)
            },
        },
        mounted() {
            // FIXME
            console.log(this.gameData)
        },
    }
</script>

<style lang="scss" scoped>
    .pass-the-poop {

        .card {
            max-width: 100px;
            width:     100%;
        }

        .bar {
            display:     flex;
            align-items: center;

            .buttons {
                margin-left: auto;
                white-space: nowrap;
                width:       min-content;
            }
        }
    }
</style>