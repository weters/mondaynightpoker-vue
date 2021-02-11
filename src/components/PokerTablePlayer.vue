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
            <toggle label="Seated" v-model="isSeated" @change="setPlayerActive"/>
            <toggle label="Start" v-model="canStart" @change="setFlag($event, 'canStart')" v-if="!isSiteAdmin" />
            <toggle label="Terminate" v-model="canTerminate" @change="setFlag($event, 'canTerminate')"  v-if="!isSiteAdmin" />
            <toggle label="Admin" v-model="isTableAdmin" @change="setFlag($event, 'isTableAdmin')" v-if="!isSiteAdmin" />
            <toggle label="Block" v-model="isBlocked" @change="setFlag($event, 'isBlocked')" v-if="!isSiteAdmin" />
        </div>
    </div>
</template>

<script>
import PlayerStatus from "@/components/PlayerStatus"
import balance from "@/mixins/balance"
import MdiIcon from "@/components/MdiIcon"
import {mdiAccountEdit} from "@mdi/js"
import bus from "@/bus"
import Toggle from "@/components/Toggle"
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
    div.player-data {
        display:     flex;
        align-items: center;

        &:not(:last-child) {
            margin-bottom: $spacing-medium;
        }

        strong {
            font-weight: normal;
            margin:      0 $spacing 0 $spacing-small;
            white-space: nowrap;

            @at-root #{$parent}:not(.connected) strong {
                color:      $border-color;
                font-style: italic;
            }
        }

        span.balance {
            color:       $green;
            margin-left: auto;
            white-space: nowrap;

            &.negative {
                color: $orange;
            }
        }

        .mdi-icon {
            margin-left: $spacing-medium;
            width:       $control-size;
        }
    }

    div.edit-player {
        border-left: 1px solid $border-color;
        padding-left: $spacing;
        margin-left: 5px;
        .toggle {
            margin-bottom: $spacing-medium;
        }
    }
}
</style>