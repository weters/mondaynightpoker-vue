<template>
    <div :class="{ 'poker-table-player': true, connected, seated }">
        <div class="player-data">
            <player-status :connected="connected" :seated="seated"/>
            <strong class="display-name">{{ displayName }}</strong>
            <span :class="{ balance: true, negative: balance < 0 }">{{ formatAmount(balance) }}</span>
            <button type="button" class="icon" @click="editTapped" v-if="canAdmin" :disabled="userClientState.playerId === this.player.playerId">
                <mdi-icon :icon="mdiAccountEdit"/>
            </button>
        </div>
        <div class="edit-player" v-if="showMenu">
            <toggle label="Playing" v-model="isSeated" @change="setPlayerActive"/>
            <toggle label="Can Start" v-model="canStart" @change="setFlag($event, 'canStart')" v-if="!isSiteAdmin" />
            <toggle label="Can Terminate" v-model="canTerminate" @change="setFlag($event, 'canTerminate')"  v-if="!isSiteAdmin" />
            <toggle label="Is Admin" v-model="isTableAdmin" @change="setFlag($event, 'isTableAdmin')" v-if="!isSiteAdmin" />
            <toggle label="Is Blocked" v-model="isBlocked" @change="setFlag($event, 'isBlocked')" v-if="!isSiteAdmin" />
        </div>
    </div>
</template>

<script>
import PlayerStatus from "@/components/PlayerStatus"
import balance from "@/mixins/balance"
import MdiIcon from "@/components/MdiIcon"
import {mdiAccountEdit} from "@mdi/js"
import bus from "@/bus"
import Toggle from "@/components/formelements/Toggle"
import {mapGetters, mapState} from "vuex"

export default {
    name: "PokerTablePlayer",
    components: {Toggle, MdiIcon, PlayerStatus},
    mixins: [balance],
    props: {
        player: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            mdiAccountEdit,
            showMenu: false,
            isSeated: this.player.active,
            canStart: this.player.canStart,
            canTerminate: this.player.canTerminate,
            isTableAdmin: this.player.isTableAdmin,
            isBlocked: this.player.isBlocked,
        }
    },
    computed: {
        ...mapState(['webSocket']),
        ...mapGetters(['userClientState']),
        canAdmin() {
            return this.userClientState.isTableAdmin || this.userClientState.player.isSiteAdmin
        },
        isSiteAdmin() {
            return this.player.player.isSiteAdmin
        },
        connected() {
            return this.player.isConnected
        },
        seated() {
            return this.player.active
        },
        displayName() {
            return this.player.player.displayName
        },
        balance() {
            return this.player.balance
        },
    },
    mounted() {
        bus.$on('edit-player', comp => {
            if (this !== comp) {
                this.showMenu = false
            }
        })
    },
    methods: {
        editTapped() {
            bus.$emit('edit-player', this)
            this.showMenu = !this.showMenu
        },
        setFlag(value, flag) {
            const data = {
                playerId: this.player.playerId,
            }
            data[flag] = value
            this.webSocket.send('tableAdmin', null, null, data)
                .catch(err => {
                    this[flag] = !value
                    this.$store.dispatch('error', err)
                })
        },
        setPlayerActive(active) {
            const payload = {
                active,
                playerId: this.player.playerId,
            }

            this.webSocket.send('playerStatus', null, null, payload)
                .catch(err => {
                    this.isSeated = !active
                    this.$store.dispatch('error', err)
                })
        }
    },
}
</script>

<style lang="scss" scoped>
@import '../variables.scss';

div.poker-table-player {
    $parent: &;
    padding: $spacing-medium;
    border-radius: $border-radius-small;
    transition: background-color $transition-fast;

    &:hover {
        background-color: rgba($primary, 0.03);
    }

    &:not(:last-child) {
        border-bottom: 1px solid rgba($border-color, 0.5);
        padding-bottom: $spacing-medium;
    }

    &.connected.seated {
        .player-status-indicator {
            background: $light-green;
        }
    }

    &:not(.connected) {
        opacity: 0.6;
    }

    &:not(.seated) {
        .display-name {
            text-decoration: line-through;
            opacity: 0.7;
        }
    }

    div.player-data {
        display:     flex;
        align-items: center;
        gap: $spacing-small;

        &:not(:last-child) {
            margin-bottom: $spacing-medium;
        }

        strong.display-name {
            font-weight: 500;
            margin-right: auto;
            white-space: nowrap;
            color: $text-color;

            @at-root #{$parent}:not(.connected) strong.display-name {
                color:      $text-color-light;
                font-style: italic;
            }
        }

        span.balance {
            font-weight: 600;
            font-size: 0.95em;
            color:       $primary;
            white-space: nowrap;
            padding: $spacing-small $spacing-medium;
            background: rgba($primary, 0.08);
            border-radius: $border-radius-small;

            &.negative {
                color: $error;
                background: rgba($error, 0.08);
            }
        }

        button.icon {
            margin-left: $spacing-small;
            padding: $spacing-small;
            background: transparent;
            border: 1px solid transparent;
            border-radius: $border-radius-small;
            color: $text-color-light;
            cursor: pointer;
            transition: all $transition-fast;
            display: flex;
            align-items: center;
            justify-content: center;

            &:hover:not(:disabled) {
                background: $gray;
                color: $primary;
                border-color: $border-color;
            }

            &:disabled {
                opacity: 0.3;
                cursor: not-allowed;
            }

            .mdi-icon {
                width: 18px;
                height: 18px;
            }
        }
    }

    div.edit-player {
        margin-top: $spacing-medium;
        padding: $spacing-medium;
        background: $gray;
        border-radius: $border-radius-small;
        display: flex;
        flex-wrap: wrap;
        gap: $spacing-medium $spacing;

        .toggle {
            margin-bottom: 0;
        }
    }
}
</style>