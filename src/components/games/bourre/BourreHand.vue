<template>
    <div class="bourre-hand">
        <bourre-card-picker
                :can-select="true"
                :max-select="1"
                v-model="selected"
                :round="round"
        />

        <div class="buttons">
            <button v-if="isTurn" :disabled="selected.length === 0" @click="playCard">Play Card</button>
        </div>
    </div>
</template>

<script>
    import BourreCardPicker from "@/components/games/bourre/BourreCardPicker"
    import {mapGetters} from "vuex"

    export default {
        name: "BourreHand",
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
                timeout: null,
            }
        },
        computed: {
            ...mapGetters({
                validMoves: 'bourre/validMoves',
                round: 'bourre/round',
                isTurn: 'bourre/isTurn',
                isRoundOver: 'bourre/isRoundOver',
                isGameOver: 'bourre/isGameOver',
            }),
        },
        watch: {
            round() {
                this.selected = []
            },
            isTurn: {
                immediate: true,
                handler(isTurn) {
                    if (isTurn) {
                        if (this.timeout) {
                            clearTimeout(this.timeout)
                            this.timeout = null
                        }

                        if (this.validMoves.length === 1) {
                            this.selected = [...this.validMoves]
                            let timeoutDuration = 500
                            if (this.$store.getters["bourre/hand"].length > 1) {
                                timeoutDuration = 4000 + Math.floor(Math.random() * 2000)
                            }

                            this.timeout = setTimeout(() => this.playCard(), timeoutDuration)
                        }
                    }
                }
            }
        },
        methods: {
            playCard() {
                if (this.timeout) {
                    clearTimeout(this.timeout)
                    this.timeout = null
                }

                this.$store.state.webSocket.send('playCard', null, this.selected)
                    .then(res => console.log(res))
                    .catch(err => {
                        this.$emit('error', err)
                    })
            },
        },
    }
</script>

<style scoped>
    div.buttons {
        white-space: nowrap;
    }
</style>