<template>
    <div class="bourre-discard">
        <bourre-card-picker
            :can-select="!isTurnOver"
            :max-select="maxDraw"
            v-model="selected"
        />

        <div :class="{ buttons: true, 'pending-turn': !isTurn }" v-if="!currentPlayer.decided">
            <template v-if="pending">
                <span class="pending-label">{{ pendingActionText }} queued</span>
                <button key="pending" class="pending" @click="pending = null">Cancel</button>
            </template>
            <template v-else>
                <confirm-button
                    label="Fold"
                    confirm-text="Confirm Fold?"
                    danger
                    :disabled="selected.length > 0"
                    @confirmed="fold"
                />
                <confirm-button
                    :label="discardLabel"
                    confirm-text="Confirm?"
                    @confirmed="discard"
                />
            </template>
        </div>
    </div>
</template>

<script>
import BourreCardPicker from "@/components/games/bourre/BourreCardPicker.vue"
import ConfirmButton from "@/components/ConfirmButton.vue"
import {mapGetters} from "vuex"

export default {
    name: "BourreDiscard",
    components: {ConfirmButton, BourreCardPicker},
    props: {
        hand: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            selected: [],
            pending: null,
        }
    },
    computed: {
        ...mapGetters({
            maxDraw: 'bourre/maxDraw',
            discards: 'bourre/discards',
            folded: 'bourre/folded',
            isTurn: 'bourre/isTurn',
            isRoundOver: 'bourre/isRoundOver',
        }),
        currentPlayer() {
            return this.$store.getters["bourre/getCurrentPlayer"](this.$store.state.user.player.id)
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
    methods: {
        discard() {
            if (!this.isTurn) {
                this.pending = 'Discard'
                return
            }

            this.$store.state.webSocket.send('discard', null, this.selected)
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

            this.$store.state.webSocket.send('discard')
                .catch(err => {
                    this.$emit('error', err)
                })
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
}
</script>

<style lang="scss" scoped>
@import '../../../variables';

.bourre-discard {
    display:         flex;
    align-items:     center;
    justify-content: space-between;
    gap:             8px;

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
        font-size:    .8rem;
        font-weight:  bold;
        animation:    2s pulse ease-in-out infinite;
    }

    @keyframes pulse {
        0%, 100% {
            color: black;
        }

        50% {
            color: $yellow;
        }
    }
}
</style>
