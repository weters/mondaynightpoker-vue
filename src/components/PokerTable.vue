<template>
    <div class="poker-table big-content">
        <div>
            <h2><span class="table-name">{{ tableName }}</span></h2>

            <div class="guest" v-if="!isSeated">
                <div class="buttons">
                    <button @click="$router.push(`/table/${uuid}/join`)">Join Table</button>
                </div>
            </div>

            <template v-if="game">
                <bourre v-if="game.game === 'bourre'"/>
                <pass-the-poop v-else-if="game.game === 'pass-the-poop'"/>
                <little-l v-else-if="game.game === 'little-l'"/>
                <seven-card v-else-if="game.game === 'seven-card'"/>
                <acey-deucey v-else-if="game.game === 'acey-deucey'"/>
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

                <form class="player-state" v-if="userClientState.isSeated">
                    <toggle :checked="userClientState.active" label="Deal me in!" :disabled="playButtonDisabled" @change="setPlayerActive" />
                    <p class="details">If you want to sit out, uncheck "Deal me in!"</p>
                </form>

                <poker-table-player-list :client-state="clientState"/>

                <p><button @click="copy">Copy Invite Link</button></p>

                <game-selector/>
            </template>
            <template v-else>
                <loading/>
            </template>

            <dealer-log class="dealer-log"/>
        </div>
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
import AceyDeucey from "@/components/games/aceydeucey/AceyDeucey"

import GameSelector from "@/components/gameselector/GameSelector"
import Toggle from "@/components/Toggle"

export default {
    name: "PokerTable",
    components: {
        Toggle,
        GameSelector,
        AceyDeucey,
        ScheduledGame, SevenCard, LittleL, PassThePoop, DealerLog, Loading, PokerTablePlayerList, Bourre,
    },
    props: {
        uuid: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            fuck: 'you',
            table: null,
            error: null,
            ws: null,
            playButtonDisabled: false,
        }
    },
    computed: {
        ...mapState(['game', 'clientState', 'user', 'scheduledGame']),
        ...mapGetters(['canStart', 'userClientState']),
        isSeated() {
            return this.clientState && this.clientState[this.user.player.id].isSeated
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
            .catch(err => {
                this.showError(err)
                this.$router.push('/my-tables')
            })

        bus.$on('error', this.listenForError)
    },
    beforeDestroy() {
        bus.$off('error', this.listenForError)
        this.ws.close()
        this.$store.commit('clearWebSocket')
        this.$store.commit('clearLogs')
    },
    methods: {
        copy() {
            const url = document.location.toString()
            navigator.clipboard.writeText(url)
                .then(() => this.$store.dispatch('notification', 'Link has been copied'))
                .catch(() => console.log('Could not copy URL to the clipboard'))
        },
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
        setPlayerActive(active) {
            this.playButtonDisabled = true
            this.ws.send('playerStatus', null, null, {active})
                .catch(err => {
                    this.showError(err)
                })
                .finally(() => this.playButtonDisabled = false)
        },
    },
    watch: {
        table(table) {
            if (table) {
                this.setTitle(this.tableName)
            }
        },
        'littleL.initialDeal': function (newVal) {
            const initialDeal = parseInt(newVal, 10)
            const tradeIns = this.littleL.tradeIns.filter(val => parseInt(val, 10) <= initialDeal)
            this.littleL.tradeIns = tradeIns
        },
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

div.guest {
    margin-bottom: $spacing;

    div.buttons {
        text-align: left;
    }
}

.poker-table-player-list {
    margin-bottom: $spacing;
}

form.player-state {
    margin: $spacing 0;

    p.details {
        font-size: 0.8em;
        margin:    $spacing-medium 0 0;
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

    div.buttons {
        margin-top: $spacing;
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

.initial-deal, .trade-ins {
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

.pt-scheduled-game {
    border-radius:       0 $border-radius 0 0;
    box-shadow:          0 0 10px rgba($primary, 0.4);
    position:            fixed;
    bottom:              0;
    left:                0;
    z-index:             10;
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
    transition: all 200ms ease-in;
}

.scheduled-game-enter, .scheduled-game-leave-to {
    opacity:   0;
    transform: translateY(100%);
}
</style>