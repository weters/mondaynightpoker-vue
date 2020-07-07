<template>
    <div class="little-l">
        <h3>Little L</h3>

        <div class="community">
            <little-l-community/>

            <p><strong>Pot: {{formatAmount(gameState.pot)}}</strong><br/>
                <strong>Current Bet: {{ formatAmount(gameState.currentBet) }}</strong></p>
        </div>

        <little-l-participants/>

        <player-bar :error="error">
            <div class="bar">
                <little-l-hand :can-select="true" v-model="selectedCards" class="bar-hand"/>

                <div class="buttons">
                    <template v-if="bet">
                        <label>
                            <span>Amount</span>
                            <input type="range" min="25" :max="gameState.pot" v-model="amount"/>
                            <input type="number" v-model="amount"/>
                        </label>
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
                        </button>
                    </template>
                </div>
            </div>

            <template v-slot:gameInfo>
                Trade: {{ tradeIns }} | {{ self.handRank }}
            </template>
        </player-bar>
    </div>
</template>

<script>
    import LittleLCommunity from "./LittleLCommunity"
    import PlayerBar from "../PlayerBar"
    import {mapGetters, mapState} from "vuex"
    import LittleLHand from "./LittleLHand"
    import balance from "../../../mixins/balance"
    import show_error from "../../../mixins/show_error"
    import LittleLParticipants from "./LittleLParticipants"

    export default {
        name: "LittleL",
        components: {LittleLParticipants, LittleLHand, PlayerBar, LittleLCommunity},
        mixins: [balance, show_error],
        data() {
            return {
                error: null,
                selectedCards: [],
                confirm: null,
                bet: null,
                amount: 25,
            }
        },
        computed: {
            ...mapState(['game']),
            ...mapGetters({
                gameState: 'littleL/gameState',
                self: 'littleL/self',
                actions: 'littleL/actions',
            }),
            tradeIns() {
                return this.gameState.tradeIns.join(', ')
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
                    case 'next-stage':
                        this.$store.state.webSocket.send('next-stage')
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
        },
    }
</script>

<style lang="scss" scoped>
    @import '../../../variables';

    .bar {
        @media (min-width: 600px) {
            align-items: center;
            display:     flex;

            .bar-hand {
                flex-grow: 1;
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

        div.buttons {
            margin: 0;
        }
    }

    div.community {
        margin-bottom: $spacing;
    }
</style>