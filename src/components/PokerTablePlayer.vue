<template>
  <div :class="{ 'poker-table-player': true, connected, seated, 'next-picker': isNextPicker }">
    <div class="player-data">
      <player-status
        :connected="connected"
        :seated="seated"
      />
      <strong class="display-name">
        <router-link
          v-if="viewerIsSiteAdmin"
          :to="`/admin/players/${player.playerId}`"
        >{{ displayName }}</router-link>
        <template v-else>{{ displayName }}</template>
      </strong>
      <span
        v-if="isNextPicker"
        class="next-picker-badge"
      >Next Pick</span>
      <span :class="{ balance: true, negative: balance < 0 }">{{ formatAmount(balance) }}</span>
      <button
        v-if="canAdmin"
        type="button"
        class="icon"
        :disabled="userClientState.playerId === player.playerId"
        @click="editTapped"
      >
        <mdi-icon :icon="mdiAccountEdit" />
      </button>
    </div>
    <div
      v-if="menuOpen"
      class="edit-player"
    >
      <toggle
        v-model="isSeated"
        label="Playing"
        @change="setPlayerActive"
      />
      <toggle
        v-if="!isSiteAdmin"
        v-model="canStart"
        label="Can Start"
        @change="setFlag($event, 'canStart')"
      />
      <toggle
        v-if="!isSiteAdmin"
        v-model="canTerminate"
        label="Can Terminate"
        @change="setFlag($event, 'canTerminate')"
      />
      <toggle
        v-if="!isSiteAdmin"
        v-model="isTableAdmin"
        label="Is Admin"
        @change="setFlag($event, 'isTableAdmin')"
      />
      <toggle
        v-if="!isSiteAdmin"
        v-model="isBlocked"
        label="Is Blocked"
        @change="setFlag($event, 'isBlocked')"
      />
    </div>
  </div>
</template>

<script>
import PlayerStatus from "@/components/PlayerStatus.vue"
import balance from "@/mixins/balance"
import MdiIcon from "@/components/MdiIcon.vue"
import {mdiAccountEdit} from "@mdi/js"
import Toggle from "@/components/formelements/Toggle.vue"
import {mapActions, mapState} from "pinia"
import {useRootStore} from "@/store"

export default {
    name: "PokerTablePlayer",
    components: {Toggle, MdiIcon, PlayerStatus},
    mixins: [balance],
    props: {
        player: {
            type: Object,
            required: true,
        },
        // the parent list owns which player's menu is open so sibling menus close
        menuOpen: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['toggle-menu'],
    data() {
        return {
            mdiAccountEdit,
            isSeated: this.player.active,
            canStart: this.player.canStart,
            canTerminate: this.player.canTerminate,
            isTableAdmin: this.player.isTableAdmin,
            isBlocked: this.player.isBlocked,
        }
    },
    computed: {
        ...mapState(useRootStore, ['userClientState']),
        canAdmin() {
            return this.userClientState.isTableAdmin || this.userClientState.player.isSiteAdmin
        },
        isSiteAdmin() {
            return this.player.player.isSiteAdmin
        },
        viewerIsSiteAdmin() {
            return Boolean(this.userClientState.player.isSiteAdmin)
        },
        connected() {
            return this.player.isConnected
        },
        seated() {
            return this.player.active
        },
        isNextPicker() {
            return Boolean(this.player.isNextPicker)
        },
        displayName() {
            return this.player.player.displayName
        },
        balance() {
            return this.player.balance
        },
    },
    methods: {
        ...mapActions(useRootStore, ['webSocketSend', 'setError']),
        editTapped() {
            this.$emit('toggle-menu')
        },
        setFlag(value, flag) {
            const data = {
                playerId: this.player.playerId,
            }
            data[flag] = value
            this.webSocketSend({action: 'tableAdmin', additionalData: data})
                .catch(err => {
                    this[flag] = !value
                    this.setError(err)
                })
        },
        setPlayerActive(active) {
            const payload = {
                active,
                playerId: this.player.playerId,
            }

            this.webSocketSend({action: 'playerStatus', additionalData: payload})
                .catch(err => {
                    this.isSeated = !active
                    this.setError(err)
                })
        }
    },
}
</script>

<style lang="scss" scoped>
div.poker-table-player {
    $parent: &;
    padding: $spacing-medium;
    border: 1px solid transparent;
    border-radius: $border-radius-small;
    transition: background-color $transition-fast;

    &:hover {
        background-color: rgba($primary, 0.03);
    }

    &:not(:last-child) {
        border-bottom: 1px solid rgba($border-color, 0.5);
        padding-bottom: $spacing-medium;
    }

    &.next-picker {
        @include current-turn;
        background-color: rgba($orange, 0.06);
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
        .display-name strong {
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

        .display-name {
            margin-right: auto;
            white-space: nowrap;
            color: $text-color;
            font-weight: 500;

            a {
                color: inherit;
                text-decoration: none;

                &:hover {
                    color: $primary;
                    text-decoration: underline;
                }
            }

            @at-root #{$parent}:not(.connected) .display-name {
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

        span.next-picker-badge {
            font-size: 0.7em;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: white;
            background: $orange;
            padding: $spacing-small $spacing-medium;
            border-radius: $border-radius-small;
            white-space: nowrap;
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