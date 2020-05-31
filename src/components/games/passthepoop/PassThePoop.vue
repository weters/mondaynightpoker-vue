<template>
    <div class="pass-the-poop">
        <h3>Pass the Poop / {{ gameData.gameState.edition }} Edition</h3>
        <pass-the-poop-participants :participants="participants"/>

        <player-bar :error="error">
            <div class="bar">
                <div class="card">
                    <transition name="card" mode="out-in">
                        <playing-card :rank="card.rank" :suit="card.suit" v-if="card" :key="`${card.rank}.${card.suit}`"/>
                    </transition>
                </div>
                <div class="buttons">
                    <button
                            type="button"
                            v-for="a in availableActions"
                            :key="a.id"
                            @click="execute(a.id)">{{a.name}}
                    </button>
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
    import showError from "../../../mixins/show_error"

    export default {
        name: "PassThePoop",
        components: {PassThePoopParticipants, PlayingCard, PlayerBar},
        mixins: [showError],
        data() {
            return {
                error: null,
                confirmStay: false,
                confirmTrade: false,
            }
        },
        computed: {
            ...mapState(['game', 'webSocket']),
            ...mapGetters({
                card: 'passThePoop/card',
                gameData: 'passThePoop/gameData',
                availableActions: 'passThePoop/availableActions',
            }),
            currentTurn() {
                return this.gameData.gameState.currentTurn && this.$store.getters.playerDataById(this.gameData.gameState.currentTurn).player.displayName
            },
            participants() {
                return this.gameData.gameState.participants.map(p => {
                    p.playerData = this.$store.getters.playerDataById(p.playerId)
                    return p
                })
            },
        },
        mounted() {
            // FIXME
            console.log(this.gameData)
        },
        methods: {
            isPlayerTurn(id) {
                return this.$store.getters['passThePoop/isPlayerTurn'](id)
            },
            execute(action) {
                this.webSocket.send('execute', String(action))
                    .then(res => console.log(res))
                    .catch(err => this.showError(err))
            },
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

    .card-enter-active, .card-leave-active {
        transition: all 500ms;
    }

    .card-enter, .card-leave-to {
        opacity: 0;
        transform: translateY(-100%);
    }
</style>