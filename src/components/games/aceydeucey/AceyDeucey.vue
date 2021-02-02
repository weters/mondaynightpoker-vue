<template>
    <div class="acey-deucey">
        <h3>Acey Deucey</h3>

        <acey-deucey-round :round="round"/>

        <acey-deucey-player-list :participants="gameState.participants"/>

        <player-bar :error="error" :is-turn="isTurn">
            <div class="acey-deucey-player-bar">
                <div class="amount" v-if="confirm && confirm.name.toLowerCase() === 'bet'">
                    <label class="optional">
                        <span>Amount</span>
                        <input type="range" min="25" step="25" :max="maxBet" v-model="amount"/>
                    </label>

                    <chip-stack :amount="parseInt(amount, 10)"/>
                </div>
                <div class="buttons">
                    <template v-if="confirm">
                        <button type="button" class="secondary" @click="confirm=null">Cancel</button>
                        <button type="button" @click="executeAction(confirm)">Yes, {{ confirm.name }}</button>
                    </template>
                    <template v-else>
                        <button type="button"
                                v-for="action in actions"
                                :key="action.id"
                                @click="confirm=action">{{ action.name }}
                        </button>
                    </template>
                </div>
            </div>
        </player-bar>
    </div>
</template>

<script>
import PlayerBar from "@/components/games/PlayerBar"
import AceyDeuceyRound from "@/components/games/aceydeucey/AceyDeuceyRound"
import {mapGetters, mapState} from "vuex"
import show_error from "@/mixins/show_error"
import balance from "@/mixins/balance"
import AceyDeuceyPlayerList from "@/components/games/aceydeucey/AceyDeuceyPlayerList"
import ChipStack from "@/components/ChipStack"

const defaultBet = '25'

export default {
    name: "AceyDeucey",
    components: {ChipStack, AceyDeuceyPlayerList, AceyDeuceyRound, PlayerBar},
    mixins: [show_error, balance],
    data() {
        return {
            error: null,
            confirm: null,
            amount: defaultBet,
        }
    },
    computed: {
        ...mapState(['game', 'webSocket']),
        ...mapGetters({
            gameState: 'aceyDeucey/gameState',
            actions: 'aceyDeucey/actions',
        }),
        isTurn() {
            return this.gameState.currentTurn === this.$store.state.user.player.id
        },
        round() {
            return this.gameState.round
        },
        maxBet() {
            return this.gameState.maxBet
        }
    },
    methods: {
        executeAction(action) {
            this.webSocket.send('execute', String(action.id), null, {
                    amount: parseInt(this.amount, 10),
                })
                .then(() => {
                })
                .catch(err => this.showError(err))
        },
    },
    watch: {
        actions() {
            this.confirm = null
        },
        confirm(confirm) {
            if (confirm && confirm.name === 'Bet') {
                this.amount = defaultBet
            }
        },
    },
}
</script>

<style lang="scss" scoped>
@import '../../../variables.scss';
div.acey-deucey {
    div.acey-deucey-player-bar {
        display: flex;
        align-items: center;
        justify-content: center;

        div.amount {
            margin-right: $spacing;
            display: flex;
            align-items: center;
            flex: 0 1 250px;

            label {
                width: 100%;

                input[type="range"] {
                    width: 100%;
                }
            }
        }

        @media(max-width: 649px) {
            flex-direction: column;

            div.amount {
                flex: 0 0 auto;
            }
        }

        div.buttons {
            margin: 0;
        }
    }
}
</style>