<template>
  <div class="bourre-discard">
    <bourre-card-picker
      v-model="selected"
      :can-select="!isTurnOver"
      :max-select="maxDraw"
    />

    <div
      v-if="!currentPlayer.decided"
      :class="{ buttons: true, 'pending-turn': !isTurn }"
    >
      <template v-if="pending">
        <span class="pending-label">{{ pendingActionText }} queued</span>
        <button
          key="pending"
          class="pending"
          @click="pending = null"
        >
          Cancel
        </button>
      </template>
      <template v-else>
        <confirm-button
          label="Fold"
          confirm-text="Confirm Fold?"
          button-class="action-fold"
          :disabled="selected.length > 0"
          @confirmed="fold"
        />
        <confirm-button
          :label="discardLabel"
          confirm-text="Confirm?"
          :button-class="selected.length === 0 ? 'action-keep-all' : ''"
          @confirmed="discard"
        />
      </template>
    </div>
  </div>
</template>

<script>
import BourreCardPicker from "@/components/games/bourre/BourreCardPicker.vue"
import ConfirmButton from "@/components/ConfirmButton.vue"
import {mapActions, mapState} from "pinia"
import {useRootStore} from "@/store"
import {useBourreStore} from "@/store/bourre"

export default {
    name: "BourreDiscard",
    components: {ConfirmButton, BourreCardPicker},
    props: {
        hand: {
            type: Array,
            required: true,
        },
    },
    emits: ['error'],
    data() {
        return {
            selected: [],
            pending: null,
        }
    },
    computed: {
        ...mapState(useBourreStore, ['maxDraw', 'discards', 'folded', 'isTurn', 'isRoundOver', 'getCurrentPlayer']),
        currentPlayer() {
            return this.getCurrentPlayer(useRootStore().user.player.id)
        },
        isTurnOver() {
            return this.discards !== null || this.folded
        },
        discardLabel() {
            return Object.keys(this.selected).length === 0 ? 'Keep All' : 'Discard Selected'
        },
        pendingActionText() {
            return this.pending === 'Fold' ? 'Fold' :
                this.pending === 'Discard' && Object.keys(this.selected).length === 0 ? 'Keep All'
                    : 'Discard'
        },
    },
    watch: {
        isTurn(isTurn) {
            if (isTurn && this.pending) {
                if (this.pending === 'Discard') {
                    this.discard()
                } else if (this.pending === 'Fold') {
                    this.fold()
                } else {
                    throw new Error(`unknown pending state: ${this.pending}`)
                }
            }
        },
        discards: {
            immediate: true,
            handler(newValue) {
                this.selected = newValue || []
            },
        },
    },
    methods: {
        ...mapActions(useRootStore, ['webSocketSend']),
        discard() {
            if (!this.isTurn) {
                this.pending = 'Discard'
                return
            }

            this.webSocketSend({action: 'discard', cards: this.selected})
                .catch(err => {
                    this.$emit('error', err)
                })
        },
        fold() {
            if (this.selected.length > 0) {
                this.$emit('error', 'You cannot fold with cards selected')
                return
            }

            if (!this.isTurn) {
                this.pending = 'Fold'
                return
            }

            this.webSocketSend({action: 'discard'})
                .catch(err => {
                    this.$emit('error', err)
                })
        },
    },
}
</script>

<style lang="scss" scoped>
.bourre-discard {
    display:         flex;
    align-items:     center;
    justify-content: space-between;
    gap:             $space-2;

    @media (max-width: $mobile-max) {
        flex-wrap:       wrap;
        justify-content: center;
        width:           100%;
    }
}

div.buttons {
    white-space: nowrap;

    &.pending-turn {
        align-items: center;
    }

    @media (max-width: $mobile-max) {
        flex-basis: 100%;
        text-align: center;
    }

    .pending-label {
        margin-right: $spacing-small;
        font-size:    $fs-sm;
        font-weight:  $fw-semibold;
        color:        $on-felt;
        animation:    2s pulse ease-in-out infinite;
    }

    button.pending {
        background: transparent;
        color:      $accent;
        border:     1px solid rgba($orange, 0.4);

        &:hover  { background: rgba($orange, 0.08); }
        &:active { background: rgba($orange, 0.15); }
    }

    @keyframes pulse {
        0%, 100% {
            color: $on-felt;
        }

        50% {
            color: $gold-soft;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .pending-label {
            animation: none;
            color:     $gold-soft;
        }
    }
}
</style>
