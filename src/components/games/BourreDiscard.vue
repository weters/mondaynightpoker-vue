<template>
    <div class="bourre-discard">
        <bourre-card-picker
                :can-select="!isTurnOver"
                :max-select="maxDraw"
                v-model="selected"
        />

        <div class="buttons">
            <template v-if="isTurn">
                <template v-if="confirmFold">
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
                    <button class="secondary" @click="confirmFold=true">Fold</button>
                    <button @click="confirmPlay=true">
                        <span v-if="Object.keys(selected).length === 0">Keep All</span>
                        <span v-else>Discard Selected</span>
                    </button>
                </template>
            </template>
            <button class="global" v-if="isRoundOver" @click="replaceDiscards">Trade Cards</button>
        </div>
    </div>
</template>

<script>
    import BourreCardPicker from "@/components/games/BourreCardPicker"
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
            isTurnOver() {
                return this.discards !== null || this.folded
            },
        },
        methods: {
            replaceDiscards() {
                this.$store.state.webSocket.send('replaceDiscards')
                    .then(res => console.log('replaceDiscards', res))
                    .catch(err => this.error = err)
            },
            discard() {
                this.$store.state.webSocket.send('discard', null, this.selected)
                    .then(res => console.log(res))
                    .catch(err => {
                        this.$emit('error', err)
                    })
            },
            fold() {
                this.error = null
                this.$store.state.webSocket.send('discard')
                    .then(res => console.log(res))
                    .catch(err => {
                        this.$emit('error', err)
                    })
            },
        },
        watch: {
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
    @import '../../variables';

    div.buttons {
        white-space: nowrap;
    }
</style>