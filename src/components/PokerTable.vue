<template>
    <div class="poker-table main-box">
        <h2>
            <span class="table-name">{{ tableName }}</span>
            <span class="game" v-if="game">{{ game.game }}</span>
        </h2>

        <transition name="error">
            <error :message="error" v-if="error"/>
        </transition>

        <template v-if="game">
            <bourre v-if="game.game === 'bourre'"/>
        </template>
        <template v-else-if="clientState">
            <form class="player-state inner" v-if="userClientState.isSeated">
                <label class="sit-out optional">
                    <span>Sit out</span>
                    <input type="checkbox" @change="setPlayerActive"
                           :checked="!userClientState.active"/>
                </label>
                <p class="details">If you want to take a break, you can check the "Sit out" box.</p>
            </form>

            <poker-table-player-list class="player-list" :client-state="clientState"/>

            <template v-if="!isSeated">
                <p class="guest">You are currently a guest.</p>

                <div class="buttons">
                    <button @click="$router.push(`/table/${uuid}/join`)">Join Table</button>
                </div>
            </template>

            <h3>Pick a Game</h3>

            <form class="bourre inner" v-if="isTableAdmin" @submit.prevent="startBourreGame">
                <h4>Bourré</h4>

                <label>
                    <span>Ante</span>
                    <input type="number" min="25" max="200" step="25" v-model="ante" />
                </label>

                <div class="buttons">
                    <button>Start</button>
                </div>
            </form>
            <div class="waiting" v-else>
                <p>Waiting on the table admin to start the game!</p>
                <loading class="loading" />
            </div>
        </template>
        <template v-else>
            <loading/>
        </template>
    </div>
</template>

<script>
    import webSocketClient from "@/webSocket"
    import Bourre from "@/components/games/Bourre"
    import {mapGetters, mapState} from "vuex"
    import PokerTablePlayerList from "@/components/games/PokerTablePlayerList"
    import Loading from "@/components/Loading"
    import Error from "@/components/Error"
    import show_error from "@/mixins/show_error"
    import client from "@/client"

    export default {
        name: "PokerTable",
        components: {Error, Loading, PokerTablePlayerList, Bourre},
        mixins: [show_error],
        props: {
            uuid: {
                type: String,
                required: true,
            },
        },
        data() {
            return {
                ante: '25',
                table: null,
                error: null,
                ws: null,
            }
        },
        computed: {
            ...mapState(['game', 'clientState', 'user']),
            ...mapGetters(['isTableAdmin', 'userClientState']),
            isSeated() {
                return this.clientState[this.user.player.id].isSeated
            },
            tableName() {
                return this.table && this.table.name
            },
        },
        mounted() {
            this.ws = new webSocketClient(this.uuid)
            this.$store.commit('setWebSocket', this.ws)

            client.getTableByUUID(this.uuid)
                .then(res => this.table = res)
                .catch(err => this.showError(err))
        },
        methods: {
            startBourreGame() {
                this.ws.send('createGame', 'bourre', null, {ante: parseInt(this.ante, 10)})
                    .catch(err => this.showError(err))
            },
            setPlayerActive(event) {
                // the field is to sit out, so we need the opposite
                const active = !event.target.checked

                event.target.disabled = true
                this.ws.send('playerStatus', null, null, { active })
                    .catch(err => {
                        event.target.checked = !event.target.checked
                        this.showError(err)
                    })
                    .finally(() => event.target.disabled = false)
            }
        },
        beforeDestroy() {
            this.ws.close()
            this.$store.commit('clearWebSocket')
        },
    }
</script>

<style lang="scss" scoped>
    @import '../variables.scss';

    span.game {
        &::before {
            content: ' / ';
        }
    }

    p.guest {
        margin-top:  $spacing;
        font-weight: bold;
        text-align:  center;
        color:       $red;
    }

    .player-list {
        margin-bottom: $spacing;
    }

    form.player-state {
        margin-bottom: $spacing;
        p.details {
            font-size: 0.8em;
            margin: 0;
        }

        label {
            display:     flex;
            align-items: center;
            margin: 0;
            width: auto;

            span {
                white-space: nowrap;
                order: 2;
            }

            input {
                order:        1;
                margin-right: $spacing-small;
            }
        }
    }

    div.waiting {
        text-align: center;

        p {
            margin: 0;
        }

        .loading {
            display: inline-block;
        }
    }

    form.bourre {
        width: min-content;
    }
</style>