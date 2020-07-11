<template>
    <div class="pass-the-poop">
        <h3>Pass the Poop / {{ gameData.gameState.edition }} Edition</h3>

        <div class="pot">
            <chip-stack :amount="pot" />
        </div>

        <pass-the-poop-participants :participants="participants"/>

        <player-bar :error="error" :is-turn="isTurn">
            <div class="bar">
                <div class="card">
                    <transition name="card" mode="out-in">
                        <playing-card :rank="card.rank" :suit="card.suit" v-if="card"
                                      :key="`${card.rank}.${card.suit}`"/>
                    </transition>
                </div>

                <div class="metadata">
                    <div class="item">
                        <span class="icon"><mdi-icon :icon="mdiCards"/></span>
                        <span class="value">{{ cardsLeftInDeck }}</span>
                    </div>
                </div>

                <div class="buttons">
                    <template v-if="confirm">
                        <button @click="confirm=null" type="button" class="secondary">Cancel</button>
                        <button @click="execute(confirm)" type="button">Yes, {{confirm.name}}</button>
                    </template>
                    <template v-else>
                        <button
                                type="button"
                                v-for="a in availableActions"
                                :key="a.id"
                                @click="confirm=a">{{a.name}}
                        </button>
                    </template>
                </div>
            </div>

            <template v-slot:gameInfo>
            <span class="turn">
                <strong>Turn:</strong>
                <span>{{ currentTurn }}</span>
            </span>
            </template>
        </player-bar>
    </div>
</template>

<script>
    import {mapGetters, mapState} from "vuex"
    import PlayerBar from "../PlayerBar"
    import PlayingCard from "../../PlayingCard"
    import PassThePoopParticipants from "./PassThePoopParticipants"
    import showError from "../../../mixins/show_error"
    import {tween} from 'popmotion'
    import MdiIcon from "../../MdiIcon"
    import {mdiCards} from "@mdi/js"
    import balance from "../../../mixins/balance"
    import ChipStack from "../../ChipStack"

    export default {
        name: "PassThePoop",
        components: {ChipStack, MdiIcon, PassThePoopParticipants, PlayingCard, PlayerBar},
        mixins: [showError, balance],
        data() {
            return {
                mdiCards,
                error: null,
                cardsLeftInDeck: 52,
                pot: 0,
                confirm: null,
            }
        },
        computed: {
            ...mapState(['game', 'webSocket', 'user']),
            ...mapGetters({
                card: 'passThePoop/card',
                gameData: 'passThePoop/gameData',
                availableActions: 'passThePoop/availableActions',
            }),
            isTurn() {
                return this.$store.getters['passThePoop/isPlayerTurn'](this.user.player.id)
            },
            currentTurn() {
                return this.gameData.gameState.currentTurn && this.$store.getters.playerDataById(this.gameData.gameState.currentTurn).player.displayName
            },
            participants() {
                return this.gameData.gameState.participants
            },
        },
        methods: {
            execute(action) {
                this.webSocket.send('execute', String(action.id))
                    .then(res => console.log(res))
                    .catch(err => this.showError(err))
            },
        },
        watch: {
            'gameData.gameState.allParticipants': {
                handler: function (newValue) {
                    const totalLives = this.gameData.gameState.lives
                    const ante = this.gameData.gameState.ante
                    let pot = 0
                    Object.values(newValue).forEach(p => pot += (totalLives - p.lives) * ante / totalLives)
                    const oldPot = this.pot

                    if (pot !== oldPot) {
                        setTimeout(() => {
                            tween({
                                from: oldPot,
                                to: pot,
                                duration: 500,
                            }).pipe(Math.round).start(val => {
                                this.pot = Math.floor(val / 25) * 25
                            })
                        }, 1000)
                    }
                },
                immediate: true,
            },
            'gameData.gameState.cardsLeftInDeck': {
                handler: function (newValue, oldValue) {
                    // doing it this way allows us to animate from 52
                    this.cardsLeftInDeck = newValue
                    tween({
                        from: parseInt(oldValue || 52, 10),
                        to: parseInt(newValue, 10),
                        duration: 500,
                    }).pipe(Math.round).start(val => {
                        this.cardsLeftInDeck = val
                    })
                },
                immediate: true,
            },
            availableActions() {
                this.confirm = null
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import '../../../variables';

    .pass-the-poop {
        .pot {
            & > * {
                margin: 0 auto;
            }

            margin-bottom: $spacing;
        }

        .card {
            max-width: 100px;
            width:     100%;
        }

        .bar {
            display:     flex;
            align-items: center;

            .buttons {
                margin-left: auto;
                white-space: nowrap;
                width:       min-content;
            }
        }
    }

    .card-enter-active, .card-leave-active {
        transition: all 500ms;
    }

    .card-enter, .card-leave-to {
        opacity:   0;
        transform: translateY(-100%);
    }

    .metadata {
        display:     flex;
        margin-left: $spacing;

        .item {
            display:        flex;
            flex-direction: column;
            align-items:    center;
            width:          min-content;

            &:not(:first-child) {
                margin-left: $spacing-small;
            }

            span.icon {
                display: block;
                width:   30px;
            }
        }
    }
</style>