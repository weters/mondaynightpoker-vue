<template>
    <div class="poker-table main-box">
        <h2><span class="table-name">{{ tableName }}</span></h2>

        <template v-if="game">
            <bourre v-if="game.game === 'bourre'"/>
            <pass-the-poop v-else-if="game.game === 'pass-the-poop'"/>
            <little-l v-else-if="game.game === 'little-l'"/>
            <seven-card v-else-if="game.game === 'seven-card'"/>
        </template>
        <template v-else-if="clientState">
            <transition name="scheduled-game">
                <scheduled-game
                        v-if="scheduledGame"
                        class="pt-scheduled-game"
                        :info="scheduledGame"
                        :can-start="canStart"
                        :is-player-active="userClientState.active"
                        @setPlayerActive="setPlayerActive"
                        @cancel="cancelGame"
                />
            </transition>

            <form class="player-state inner" v-if="userClientState.isSeated">
                <label class="play optional">
                    <span>Play</span>
                    <input type="checkbox"
                           @change="setPlayerActive"
                           :checked="userClientState.active"/>
                </label>
                <p class="details">If you want to take a break, uncheck the "Play" box.</p>
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

                <form class="seven-card inner" @submit.prevent="startSevenCardGame">
                    <h4>Seven Card</h4>

                    <label class="ante">
                        <span>Ante</span>
                        <span>
                        <input type="number" min="25" max="400" step="25" v-model="sevenCard.ante"/>
                        <em>¢</em>
                    </span>
                    </label>

                    <label class="variant">
                        <span>Variant</span>
                        <select v-model="sevenCard.variant">
                            <option value="stud">Seven-Card Stud</option>
                            <option value="low-card-wild">Low Card Wild</option>
                            <option value="baseball">Baseball</option>
                        </select>
                    </label>

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
    import SevenCard from "./games/sevencard/SevenCard"
    import bus from "../bus"
    import ScheduledGame from "./ScheduledGame"

    export default {
        name: "PokerTable",
        components: {ScheduledGame, SevenCard, LittleL, PassThePoop, DealerLog, Loading, PokerTablePlayerList, Bourre},
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
                sevenCard: {
                    ante: '25',
                    variant: 'stud',
                },
                table: null,
                error: null,
                ws: null,
            }
        },
        computed: {
            ...mapState(['game', 'clientState', 'user', 'scheduledGame']),
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

            bus.$on('error', this.listenForError)
        },
        beforeDestroy() {
            bus.$off('error', this.listenForError)
            this.ws.close()
            this.$store.commit('clearWebSocket')
            this.$store.commit('clearLogs')
        },
        methods: {
            listenForError(err) {
                this.showError(err)
            },
            showError(err) {
                this.$store.dispatch('error', err)
            },
            cancelGame() {
                this.ws.send('cancelGame')
                    .catch(err => this.showError(err))
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
            startSevenCardGame() {
                this.ws.send('createGame', 'seven-card', null, {
                        ante: parseInt(this.sevenCard.ante, 10),
                        variant: this.sevenCard.variant,
                    })
                    .catch(err => this.showError(err))
            },
            setPlayerActive(event) {
                const active = event.target.checked

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

    .pt-scheduled-game {
        border-radius:       0 $border-radius 0 0;
        box-shadow:          0 0 10px rgba($primary, 0.4);
        position:            fixed;
        bottom:              0;
        left:                0;
        z-index:             100;
        max-width:           500px;
        border:              1px solid $primary;
        border-left-width:   0;
        border-bottom-width: 0;

        @media (max-width: $mobile-max) {
            left:              $spacing + $spacing-medium;
            right:             $spacing + $spacing-medium;
            border-radius:     $border-radius $border-radius 0 0;
            max-width:         none;
            border-left-width: 1px;
        }
    }

    .scheduled-game-enter-active, .scheduled-game-leave-active {
        transition: all 400ms;
    }

    .scheduled-game-enter, .scheduled-game-leave-to {
        transform: translateY(100%);
    }
</style>