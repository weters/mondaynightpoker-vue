<template>
    <player-bar :error="error" :is-turn="isTurn">
        <div class="bar">
            <div class="bar-hand">
                <slot></slot>
            </div>

            <div class="buttons">
                <template v-if="bet">
                    <div class="amount">
                        <label class="optional">
                            <span>Amount</span>
                            <input type="range" :min="startingBet" :step="gameState.ante" :max="gameState.maxBet"
                                   v-model="amount"/>
                        </label>

                        <span class="amount">{{formatAmount(amount)}}</span>
                    </div>
                    <button class="secondary" type="button" @click="bet=null">Cancel</button>
                    <button type="button" @click="handleBet">Yes, {{ bet.name }}</button>
                </template>
                <template v-else-if="confirm">
                    <button class="secondary" type="button" @click="confirm=null">Cancel</button>
                    <button type="button" @click="handleConfirm">Yes, {{ confirm.name }}</button>
                </template>
                <template v-else>
                    <button type="button" v-for="action in actions" :key="action.id" @click="handleAction(action)">
                        {{action.name}}
                        <template v-if="action.id === 'call'">
                            {{formatAmount(gameState.currentBet - self.currentBet)}}
                        </template>
                    </button>
                </template>
            </div>
        </div>

        <template v-slot:gameInfo>
            {{ self.handRank }}
        </template>
    </player-bar>
</template>

<script>
    import PlayerBar from "./PlayerBar"
    import {mapGetters} from "vuex"
    import balance from "../../mixins/balance"

    export default {
        name: "PokerPlayerBar",
        components: {PlayerBar},
        mixins: [balance],
        props: {
            selectedCards: {
                type: Array,
                default: () => [],
            },
        },
        data() {
            return {
                error: null,
                confirm: null,
                bet: null,
                startingBet: 0,
                amount: 0,
            }
        },
        computed: {
            ...mapGetters({
                self: 'poker/self',
                gameState: 'poker/gameState',
                actions: 'poker/actions',
            }),
            isTurn() {
                return this.gameState.currentTurn === this.self.playerId || this.gameState.action === this.self.playerId
            },
        },
        methods: {
            handleAction(action) {
                switch (action.id) {
                    case 'trade':
                    case 'check':
                    case 'call':
                    case 'end-game':
                    case 'fold':
                        this.confirm = action
                        break
                    case 'raise':
                    case 'bet':
                        this.bet = action
                        break
                    case 'next-round':
                        this.$store.state.webSocket.send('next-round')
                            .catch(err => this.showError(err))
                        break
                    default:
                        throw new Error(`unknown action: ${action.id}`)
                }
            },
            handleBet() {
                const amount = parseInt(this.amount, 10)
                this.$store.state.webSocket.send(this.bet.id, null, null, {
                        amount,
                    })
                    .catch(err => this.showError(err))
            },
            handleConfirm() {
                switch (this.confirm.id) {
                    case 'trade':
                        this.$store.state.webSocket.send(this.confirm.id, null, this.selectedCards)
                            .catch(err => this.showError(err))
                        break
                    case 'check':
                    case 'fold':
                    case 'call':
                    case 'end-game':
                        this.$store.state.webSocket.send(this.confirm.id)
                            .catch(err => this.showError(err))
                        break
                }
            },
        },
        watch: {
            actions() {
                this.confirm = null
                this.bet = null
            },
            bet() {
                this.startingBet = this.gameState.currentBet ? this.gameState.currentBet * 2 : this.gameState.ante
                this.amount = this.startingBet
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import '../../variables';

    .bar {
        div.buttons {
            margin: 0;
        }

        @media (min-width: 600px) {
            align-items: center;
            display:     flex;

            .bar-hand {
                flex-grow: 1;
            }

            div.buttons {
                margin-left: $spacing-medium;
            }
        }

        @media (max-width: 599px) {
            .bar-hand {
                margin-bottom: $spacing-medium;
            }
        }

        & > :nth-child(2) {
            margin-left: auto;
        }

        div.amount {
            margin: 0 0 $spacing-medium $spacing-medium;

            label {
                margin: 0;

                span {
                    font-weight: bold;
                    text-align:  left;
                }

                input[type="range"] {
                    padding: 0;
                }
            }
        }
    }
</style>