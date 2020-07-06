<template>
    <div class="little-l">
        <h3>Little L</h3>

        <little-l-community/>

        <pre>{{ JSON.stringify(game, null, '  ' )}}</pre>

        <player-bar :error="error">
            <div class="bar">
                <little-l-hand :can-select="true" v-model="selectedCards" class="bar-hand" />

                <div class="buttons">
                    <template v-if="confirm">
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
                Trade: {{ tradeIns }}
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

    export default {
        name: "LittleL",
        components: {LittleLHand, PlayerBar, LittleLCommunity},
        mixins: [balance, show_error],
        data() {
            return {
                error: null,
                selectedCards: [],
                confirm: null,
            }
        },
        computed: {
            ...mapState(['game']),
            ...mapGetters({
                gameState: 'littleL/gameState',
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
                        this.confirm = action
                        break
                }
            },
            handleConfirm() {
                switch (this.confirm.id) {
                    case 'trade':
                        this.$store.state.webSocket.send('trade', null, this.selectedCards)
                            .catch(err => this.showError(err))
                        break
                }
            },
        },
        watch: {
            actions() {
                this.confirm = null
            },
        },
    }
</script>

<style lang="scss" scoped>
    .bar {
        display: flex;
        align-items: center;
        .bar-hand {
            flex-grow: 1;
        }
        & > :nth-child(2) {
            margin-left: auto;
        }

        div.buttons {
            margin: 0;
        }
    }
</style>