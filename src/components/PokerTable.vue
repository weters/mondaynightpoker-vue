<template>
    <div class="poker-table main-box">
        <h2><span class="table-name">{{ tableName }}</span></h2>

        <template v-if="game">
            <bourre v-if="game.game === 'bourre'"/>
            <pass-the-poop v-else-if="game.game === 'pass-the-poop'"/>
            <little-l v-else-if="game.game === 'little-l'" />
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

            <div class="game-selector" v-if="canStart">
                <form class="bourre inner" @submit.prevent="startBourreGame">
                    <h4>Bourré</h4>

                    <label class="ante">
                        <span>Ante</span>
                        <span>
                        <input type="number" min="25" max="200" step="25" v-model="bourre.ante"/>
                        <em>¢</em>
                    </span>
                    </label>

                    <div class="buttons">
                        <button>Start</button>
                    </div>
                </form>

                <form class="pass-the-poop inner" @submit.prevent="startPassThePoopGame">
                    <h4>Pass the Poop</h4>

                    <label class="ante">
                        <span>Ante</span>
                        <span>
                        <input type="number" min="25" max="400" step="25" v-model="passThePoop.ante"/>
                        <em>¢</em>
                    </span>
                    </label>

                    <label class="edition">
                        <span>Edition</span>
                        <select v-model="passThePoop.edition">
                            <option value="standard">Standard</option>
                            <option value="diarrhea">Diarrhea</option>
                            <option value="pairs">Pairs</option>
                        </select>
                    </label>

                    <label class="lives">
                        <span>Lives</span>
                        <select v-model="passThePoop.lives">
                            <option value="3">3</option>
                            <option value="2">2</option>
                            <option value="1">1</option>
                        </select>
                    </label>

                    <div class="buttons">
                        <button>Start</button>
                    </div>
                </form>

                <form class="little-l inner" @submit.prevent="startLittleLGame">
                    <h4>Little L</h4>

                    <label class="ante">
                        <span>Ante</span>
                        <span>
                        <input type="number" min="25" max="400" step="25" v-model="littleL.ante"/>
                        <em>¢</em>
                    </span>
                    </label>

                    <div class="trade-ins">
                        <span>Trade-ins</span>

                        <label v-for="i in 5" :key="i" class="optional checkbox"><input type="checkbox" :value="i-1"
                                                                                        v-model="littleL.tradeIns"/><span>{{i-1}}</span></label>
                    </div>

                    <div class="buttons">
                        <button>Start</button>
                    </div>
                </form>
            </div>

            <div class="waiting" v-else>
                <p>Waiting on the table admin to start the game!</p>
                <loading class="loading"/>
            </div>
        </template>
        <template v-else>
            <loading/>
        </template>

        <dealer-log class="dealer-log"/>
    </div>
</template>

<script>
    import webSocketClient from "@/webSocket"
    import {mapGetters, mapState} from "vuex"
    import PokerTablePlayerList from "@/components/games/PokerTablePlayerList"
    import Loading from "@/components/Loading"
    import client from "@/client"
    import DealerLog from "./DealerLog"
    import Bourre from '@/components/games/bourre/Bourre'
    import PassThePoop from "./games/passthepoop/PassThePoop"
    import LittleL from "./games/littlel/LittleL"

    export default {
        name: "PokerTable",
        components: {LittleL, PassThePoop, DealerLog, Loading, PokerTablePlayerList, Bourre},
        props: {
            uuid: {
                type: String,
                required: true,
            },
        },
        data() {
            return {
                bourre: {
                    ante: '25',
                },
                passThePoop: {
                    ante: '150',
                    edition: 'standard',
                    lives: '3',
                },
                littleL: {
                    ante: '25',
                    tradeIns: ['0', '2'],
                },
                table: null,
                error: null,
                ws: null,
            }
        },
        computed: {
            ...mapState(['game', 'clientState', 'user']),
            ...mapGetters(['canStart', 'userClientState']),
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
        beforeDestroy() {
            this.ws.close()
            this.$store.commit('clearWebSocket')
            this.$store.commit('clearLogs')
        },
        methods: {
            showError(err) {
                this.$store.dispatch('error', err)
            },
            startBourreGame() {
                this.ws.send('createGame', 'bourre', null, {ante: parseInt(this.bourre.ante, 10)})
                    .catch(err => this.showError(err))
            },
            startPassThePoopGame() {
                this.ws.send('createGame', 'pass-the-poop', null, {
                        ante: parseInt(this.passThePoop.ante, 10),
                        edition: this.passThePoop.edition,
                        lives: parseInt(this.passThePoop.lives, 10),
                    })
                    .catch(err => this.showError(err))
            },
            startLittleLGame() {
                this.ws.send('createGame', 'little-l', null, {
                    ante: parseInt(this.littleL.ante, 10),
                    tradeIns: this.littleL.tradeIns.map(v => parseInt(v, 10)),
                })
                .catch(err => this.showError(err))
            },
            setPlayerActive(event) {
                // the field is to sit out, so we need the opposite
                const active = !event.target.checked

                event.target.disabled = true
                this.ws.send('playerStatus', null, null, {active})
                    .catch(err => {
                        event.target.checked = !event.target.checked
                        this.showError(err)
                    })
                    .finally(() => event.target.disabled = false)
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import '../variables.scss';

    h2 {
        margin: 0;
    }

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
            margin:    0;
        }

        label {
            display:     flex;
            align-items: center;
            margin:      0;
            width:       auto;

            span {
                white-space: nowrap;
                order:       2;
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

    label.ante {
        width: 100%;

        & > span:last-child {
            display:     flex;
            align-items: center;

            &::after {
                content: '';
            }

            em {
                font-style: normal;
            }
        }
    }

    form.bourre {
        width: min-content;
    }

    .dealer-log {
        margin-top: $spacing;
    }

    .trade-ins {
        margin-bottom: $spacing;

        label {
            margin: 0;
            width:  auto;

            span {
                display:        inline-block;
                margin-left:    $spacing-small;
                vertical-align: middle;
            }

            input {
                display:        inline-block;
                width:          auto;
                vertical-align: middle;
            }
        }
    }

    .game-selector {
        display: block;

        form {
            margin-bottom: $spacing;
            width:         100%;

            label {
                width: 100%;
            }

            input[type="text"], select {
                width: 100%;
            }
        }
    }
</style>