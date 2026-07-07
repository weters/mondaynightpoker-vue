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
    import BourreCardPicker from "@/components/games/bourre/BourreCardPicker.vue"
    import {mapActions, mapState} from "pinia"
    import {useRootStore} from "@/store"
    import {useBourreStore} from "@/store/bourre"

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
            ...mapState(useBourreStore, ['validMoves', 'round', 'isTurn', 'isRoundOver', 'isGameOver', 'hand']),
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
                            if (this.hand.length > 1) {
                                timeoutDuration = 4000 + Math.floor(Math.random() * 2000)
                            }

                            this.timeout = setTimeout(() => this.playCard(), timeoutDuration)
                        }
                    }
                }
            }
        },
        methods: {
            ...mapActions(useRootStore, ['webSocketSend']),
            playCard() {
                if (this.timeout) {
                    clearTimeout(this.timeout)
                    this.timeout = null
                }

                this.webSocketSend({action: 'playCard', cards: this.selected})
                    .catch(err => {
                        this.$emit('error', err)
                    })
            },
        },
    }
</script>

<style lang="scss" scoped>
    .bourre-hand {
        display: flex;
        align-items: center;
        gap: 8px;

        @media (max-width: $mobile-max) {
            flex-wrap: wrap;
            justify-content: center;
            width: 100%;
        }
    }

    div.buttons {
        white-space: nowrap;

        @media (max-width: $mobile-max) {
            flex-basis: 100%;
            text-align: center;
        }
    }
</style>