<template>
  <div class="poker-table big-content">
    <div>
      <div class="table-header">
        <h2><span class="table-name">{{ tableName }}</span></h2>
        <button
          v-if="table"
          class="invite-button"
          @click="copy"
        >
          <mdi-icon :icon="mdiContentCopy" />
          <span>Copy Invite Link</span>
        </button>
      </div>

      <div
        v-if="!isSeated"
        class="guest"
      >
        <div class="buttons">
          <button @click="$router.push(`/table/${uuid}/join`)">
            Join Table
          </button>
        </div>
      </div>

      <!-- Wait for clientState before mounting the game: on reload the game message
           can arrive before clientState, and the game subtree (PlayerBar, participant
           lists) dereferences per-player clientState during render. -->
      <template v-if="game && clientState">
        <component
          :is="gameComponent"
          v-if="gameComponent"
        />
      </template>
      <template v-else-if="clientState">
        <transition name="scheduled-game">
          <scheduled-game
            v-if="scheduledGame"
            class="pt-scheduled-game"
            :info="scheduledGame"
            :can-start="canStart"
            :is-player-active="userClientState.active"
            @set-player-active="setPlayerActive"
            @cancel="cancelGame"
          />
        </transition>

        <div class="player-settings">
          <h3>Your Settings</h3>

          <div class="columns">
            <table-stakes />

            <form
              v-if="userClientState.isSeated"
              class="player-state"
            >
              <toggle
                :model-value="userClientState.active"
                label="Deal me in!"
                :disabled="playButtonDisabled"
                @change="setPlayerActive"
              />
              <toggle
                v-model="muteSounds"
                label="Mute sounds"
                class="mute-sounds"
              />
              <p class="details">
                If you want to sit out, uncheck "Deal me in!"
              </p>
            </form>
          </div>
        </div>

        <div class="main-content">
          <poker-table-player-list :client-state="clientState" />
          <game-selector />
        </div>
      </template>
      <template v-else>
        <loading />
      </template>

      <dealer-log class="dealer-log" />

      <div
        v-if="clientState && !game && isTableAdmin"
        class="admin-actions"
      >
        <h3>Admin</h3>
        <form
          class="clone-table"
          @submit.prevent="cloneTable"
        >
          <error-message
            v-if="cloneError"
            :message="cloneError"
          />
          <p class="details">
            Clone this table to start a fresh session with the same players. Balances reset to zero, table stake carries over, and everyone starts in sit-out.
          </p>
          <fancy-input
            v-model="cloneName"
            label="New Table Name"
            type="text"
            autocomplete="off"
            required
            :disabled="cloneLoading"
          />
          <div class="buttons">
            <button
              type="submit"
              :disabled="cloneLoading || !cloneName"
            >
              Clone Table
            </button>
          </div>
          <loading v-if="cloneLoading" />
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import * as webSocket from "@/webSocket"
import {mapActions, mapState} from "pinia"
import {useRootStore} from "@/store"
import PokerTablePlayerList from "@/components/games/PokerTablePlayerList.vue"
import Loading from "@/components/Loading.vue"
import client from "@/client"
import DealerLog from "./DealerLog.vue"
import ScheduledGame from "./ScheduledGame.vue"
import {componentForSlug} from "@/games"

import GameSelector from "@/components/gameselector/GameSelector.vue"
import Toggle from "@/components/formelements/Toggle.vue"
import TableStakes from "@/components/TableStakes.vue"
import MdiIcon from "@/components/MdiIcon.vue"
import {mdiContentCopy} from "@mdi/js"
import audioplayer from "@/audioplayer"
import FancyInput from "@/components/formelements/FancyInput.vue"
import ErrorMessage from "@/components/ErrorMessage.vue"

export default {
    name: "PokerTable",
    components: {
        MdiIcon,
        TableStakes,
        Toggle,
        GameSelector,
        FancyInput,
        ErrorMessage,
        ScheduledGame, DealerLog, Loading, PokerTablePlayerList,
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
            playButtonDisabled: false,
            muteSounds: audioplayer.muted,
            cloneName: '',
            cloneLoading: false,
            cloneError: null,
        }
    },
    computed: {
        ...mapState(useRootStore, ['game', 'clientState', 'user', 'scheduledGame', 'canStart', 'isTableAdmin', 'userClientState']),
        gameComponent() {
            return componentForSlug(this.game?.game)
        },
        isSeated() {
            return this.clientState && this.clientState[this.user.player.id]?.isSeated
        },
        tableName() {
            return this.table && this.table.name
        },
    },
    watch: {
        table(table) {
            if (table) {
                this.setTitle(this.tableName)
            }
        },
        game(newVal, oldVal) {
            if (newVal && !oldVal) {
                this.$nextTick(() => {
                    this.$el.scrollIntoView({behavior: 'smooth'})
                })
            }
        },
        muteSounds(newVal) {
            audioplayer.setMuted(newVal)
        },
    },
    mounted() {
        webSocket.connect(this.uuid, useRootStore())

        client.getTableByUUID(this.uuid)
            .then(res => this.table = res)
            .catch(err => {
                this.showError(err)
                this.$router.push('/my-tables')
            })
    },
    beforeUnmount() {
        webSocket.disconnect()
        this.clearLogs()
    },
    methods: {
        ...mapActions(useRootStore, ['clearLogs', 'setError', 'setNotification', 'webSocketSend']),
        copy() {
            const url = document.location.toString()
            navigator.clipboard.writeText(url)
                .then(() => this.setNotification('Link has been copied'))
                .catch(() => console.log('Could not copy URL to the clipboard'))
        },
        showError(err) {
            this.setError(err)
        },
        cancelGame() {
            this.webSocketSend({action: 'cancelGame'})
                .catch(err => this.showError(err))
        },
        setPlayerActive(active) {
            this.playButtonDisabled = true
            this.webSocketSend({action: 'playerStatus', additionalData: {active}})
                .catch(err => {
                    this.showError(err)
                })
                .finally(() => this.playButtonDisabled = false)
        },
        cloneTable() {
            if (this.cloneLoading || !this.cloneName) return
            this.cloneLoading = true
            this.cloneError = null
            client.cloneTable(this.uuid, this.cloneName)
                .then(res => this.$router.push(`/table/${encodeURIComponent(res.uuid)}`))
                .then(() => window.scrollTo(0, 0))
                .catch(err => this.cloneError = err)
                .finally(() => this.cloneLoading = false)
        },
    },
}
</script>

<style lang="scss" scoped>
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

        .mute-sounds {
            margin-top: $spacing-medium;
        }

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

    div.admin-actions {
        margin-top: $spacing * 1.5;

        h3 {
            @include section-header;
        }

        form.clone-table {
            @include card;
            padding: $spacing;

            p.details {
                font-size: 0.85em;
                color: $text-color-light;
                margin: 0 0 $spacing-medium;
            }

            div.buttons {
                margin-top: $spacing-medium;
            }
        }
    }
}
</style>