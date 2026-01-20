<template>
    <div class="poker-table big-content">
        <div>
            <div class="table-header">
                <h2><span class="table-name">{{ tableName }}</span></h2>
                <button @click="copy" class="invite-button" v-if="table">
                    <mdi-icon :icon="mdiContentCopy"/>
                    <span>Copy Invite Link</span>
                </button>
            </div>

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
                <texas-hold-em v-else-if="game.game === 'texas-hold-em'"/>
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

                <div class="player-settings">
                    <h3>Your Settings</h3>

                    <div class="columns">
                        <table-stakes/>

                        <form class="player-state" v-if="userClientState.isSeated">
                            <toggle :checked="userClientState.active" label="Deal me in!" :disabled="playButtonDisabled"
                                    @change="setPlayerActive"/>
                            <p class="details">If you want to sit out, uncheck "Deal me in!"</p>
                        </form>
                    </div>
                </div>

                <div class="main-content">
                    <poker-table-player-list :client-state="clientState"/>
                    <game-selector/>
                </div>
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
import PokerTablePlayerList from "@/components/games/PokerTablePlayerList.vue"
import Loading from "@/components/Loading.vue"
import client from "@/client"
import DealerLog from "./DealerLog.vue"
import Bourre from '@/components/games/bourre/Bourre.vue'
import PassThePoop from "./games/passthepoop/PassThePoop.vue"
import LittleL from "./games/littlel/LittleL.vue"
import SevenCard from "./games/sevencard/SevenCard.vue"
import bus from "../bus"
import ScheduledGame from "./ScheduledGame.vue"
import AceyDeucey from "@/components/games/aceydeucey/AceyDeucey.vue"

import GameSelector from "@/components/gameselector/GameSelector.vue"
import Toggle from "@/components/formelements/Toggle.vue"
import TexasHoldEm from "@/components/games/texasholdem/TexasHoldEm.vue"
import TableStakes from "@/components/TableStakes.vue"
import MdiIcon from "@/components/MdiIcon.vue"
import {mdiContentCopy} from "@mdi/js"

export default {
    name: "PokerTable",
    components: {
        MdiIcon,
        TableStakes,
        TexasHoldEm,
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
            mdiContentCopy,
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

        bus.on('error', this.listenForError)
    },
    beforeUnmount() {
        bus.off('error', this.listenForError)
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
    },
}
</script>

<style lang="scss" scoped>
@import '../variables.scss';

.poker-table {

    .table-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: $spacing + $spacing-medium;
        padding-bottom: $spacing;
        border-bottom: 1px solid $border-color;

        h2 {
            margin: 0;
            font-size: 1.5rem;
            font-weight: 600;
            color: $secondary;

            .table-name {
                background: linear-gradient(135deg, $primary, $secondary);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
        }

        .invite-button {
            display: flex;
            align-items: center;
            gap: $spacing-small;
            padding: $spacing-medium $spacing;
            background: white;
            border: 1px solid $border-color;
            border-radius: $border-radius;
            color: $primary;
            font-weight: 500;
            cursor: pointer;
            transition: all $transition-fast;

            &:hover {
                background: $primary;
                color: white;
                border-color: $primary;
                box-shadow: $shadow-md;
            }

            .mdi-icon {
                width: 1.1em;
                height: 1.1em;
            }
        }
    }

    span.game {
        &::before {
            content: ' / ';
        }
    }

    div.guest {
        @include card;
        padding: $spacing;
        margin-bottom: $spacing;
        text-align: center;

        div.buttons {
            text-align: center;

            button {
                padding: $spacing-medium $spacing;
                font-size: 1rem;
            }
        }
    }

    .main-content {
        display: grid;
        grid-template-columns: minmax(280px, 1fr) 2fr;
        gap: $spacing;
        align-items: start;

        @media (max-width: 900px) {
            grid-template-columns: 1fr;
        }
    }

    .poker-table-player-list {
        margin-bottom: $spacing;
    }

    form.player-state {
        @include card;
        padding: $spacing;

        p.details {
            font-size: 0.85em;
            color: $text-color-light;
            margin: $spacing-medium 0 0;
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
        @include card;
        padding: $spacing * 2;

        p {
            margin: 0 0 $spacing-medium;
            color: $text-color-light;
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
        margin-top: $spacing * 1.5;
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
        border-radius:       0 $border-radius-large 0 0;
        box-shadow:          $shadow-lg;
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
            border-radius:     $border-radius-large $border-radius-large 0 0;
            max-width:         none;
            border-left-width: 1px;
        }
    }

    .scheduled-game-enter-active, .scheduled-game-leave-active {
        transition: all 200ms ease-in;
    }

    .scheduled-game-enter-from, .scheduled-game-leave-to {
        opacity:   0;
        transform: translateY(100%);
    }

    div.player-settings {
        margin-bottom: $spacing * 1.5;

        h3 {
            @include section-header;
        }

        .columns {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: $spacing;

            @media (max-width: $mobile-max) {
                grid-template-columns: 1fr;
            }
        }
    }
}
</style>