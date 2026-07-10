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
    border-radius: $radius-sm;
    transition: background-color $dur-fast $ease-standard, box-shadow $dur-fast $ease-standard;

    &:hover {
        background-color: rgba($primary, 0.03);
    }

    &:not(:last-child) {
        border-bottom: 1px solid rgba($hairline, 0.6);
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
            color: $ink;
            font-weight: $fw-medium;

            a {
                color: inherit;
                text-decoration: none;

                &:hover {
                    color: $primary;
                    text-decoration: underline;
                }
            }

            @at-root #{$parent}:not(.connected) .display-name {
                color:      $ink-muted;
                font-style: italic;
            }
        }

        span.balance {
            @include numeric;
            font-weight: $fw-semibold;
            font-size: $fs-sm;
            color:       $primary;
            white-space: nowrap;
            padding: $spacing-small $spacing-medium;
            background: rgba($primary, 0.08);
            border-radius: $radius-sm;

            &.negative {
                color: $negative;
                background: rgba($negative, 0.08);
            }
        }

        span.next-picker-badge {
            font-size: $fs-2xs;
            font-weight: $fw-semibold;
            text-transform: uppercase;
            letter-spacing: $tracking-wide;
            color: $accent-ink;
            background: $accent;
            padding: $spacing-small $spacing-medium;
            border-radius: $radius-sm;
            white-space: nowrap;
        }

        button.icon {
            margin-left: $spacing-small;
            @include tap-target;
            padding: $spacing-small;
            background: transparent;
            border: 1px solid transparent;
            border-radius: $radius-sm;
            color: $ink-muted;
            cursor: pointer;
            transition: background $dur-fast $ease-standard, color $dur-fast $ease-standard,
                        border-color $dur-fast $ease-standard;
            display: flex;
            align-items: center;
            justify-content: center;

            &:hover:not(:disabled) {
                background: $gray;
                color: $primary;
                border-color: $hairline;
            }

            &:focus-visible {
                @include focus-ring;
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
        border-radius: $radius-sm;
        display: flex;
        flex-wrap: wrap;
        gap: $spacing-medium $spacing;

        .toggle {
            margin-bottom: 0;
        }
    }
}
</style>