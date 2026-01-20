<template>
    <div class="bourre-discard">
        <bourre-card-picker
            :can-select="!isTurnOver"
            :max-select="maxDraw"
            v-model="selected"
        />

        <div class="buttons">
            <div :class="{ 'pending-turn': !isTurn }" v-if="!currentPlayer.decided">
                <template v-if="pending">
                    <button key="pending" class="pending" @click="pending = null">{{ pendingButtonText }}</button>
                </template>
                <template v-else-if="confirmFold">
                    <button class="secondary" @click="confirmFold=false">Cancel</button>
                    <button @click="fold">Yes, Fold</button>
                </template>
                <template v-else-if="confirmPlay">
                    <button class="secondary" @click="confirmPlay=false">Cancel</button>
                    <button @click="discard">
                        <span v-if="Object.keys(selected).length === 0">Yes, Keep All</span>
                        <span v-else>Yes, Discard Selected</span>
                    </button>
                </template>
                <template v-else>
                    <button class="secondary" @click="setConfirmFold">Fold</button>
                    <button @click="confirmPlay=true">
                        <span v-if="Object.keys(selected).length === 0">Keep All</span>
                        <span v-else>Discard Selected</span>
                    </button>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import BourreCardPicker from "@/components/games/bourre/BourreCardPicker.vue"
import {mapGetters} from "vuex"

export default {
    name: "BourreDiscard",
    components: {BourreCardPicker},
    props: {
        hand: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            selected: [],
            confirmFold: false,
            confirmPlay: false,
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
        pendingButtonText() {
            return this.pending === 'Fold' ? 'Fold' :
                this.pending === 'Discard' && Object.keys(this.selected).length === 0 ? 'Keep All'
                    : 'Discard Selected'
        },
    },
    methods: {
        discard() {
            if (!this.isTurn) {
                this.pending = 'Discard'
                return
            }

            this.$store.state.webSocket.send('discard', null, this.selected)
                .then(res => console.log(res))
                .catch(err => {
                    this.$emit('error', err)
                })
        },
        setConfirmFold() {
            if (this.selected.length > 0) {
                this.$emit('error', 'You cannot fold with cards selected')
                return
            }

            this.confirmFold = true
        },
        fold() {
            if (!this.isTurn) {
                this.pending = 'Fold'
                return
            }

            this.error = null
            this.$store.state.webSocket.send('discard')
                .then(res => console.log(res))
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
        pending(pending) {
            if (pending) {
                this.confirmFold = false
                this.confirmPlay = false
            }
        },
    },
}
</script>

<style lang="scss" scoped>
@import '../../../variables';

div.buttons {
    white-space: nowrap;

    .pending-turn {
        button {
            background-color: #888;

            &.secondary {
                background-color: transparent;
                color:            #888;
            }

            &.pending {
                box-shadow: 0 0 5px 2px $yellow;
            }
        }
    }
}
</style>