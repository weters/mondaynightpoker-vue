<template>
    <div class="pass-the-poop">
        <h3>Pass the Poop / {{ gameData.gameState.edition }} Edition</h3>

        <div class="pot-row">
            <chip-stack :amount="pot" />
            <div class="cards-left">
                <span class="icon"><mdi-icon :icon="mdiCards"/></span>
                <span class="value">{{ cardsLeftInDeck }}</span>
            </div>
        </div>

        <pass-the-poop-participants :participants="participants"/>

        <player-bar :error="error" :is-turn="isTurn">
            <template #cards>
                <div class="card">
                    <transition name="card" mode="out-in">
                        <playing-card :rank="card.rank" :suit="card.suit" v-if="card"
                                      :key="`${card.rank}.${card.suit}`"/>
                    </transition>
                </div>
            </template>

            <template #actions>
                <div class="buttons">
                    <confirm-button
                        v-for="a in availableActions"
                        :key="a.id"
                        :label="a.name"
                        :confirm-text="`Confirm ${a.name}?`"
                        @confirmed="execute(a)"
                    />
                </div>
            </template>

            <template #gameInfo>
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
    import PlayerBar from "../PlayerBar.vue"
    import PlayingCard from "../../PlayingCard.vue"
    import PassThePoopParticipants from "./PassThePoopParticipants.vue"
    import ConfirmButton from "@/components/ConfirmButton.vue"
    import showError from "../../../mixins/show_error"
    import {animate} from 'popmotion'
    import MdiIcon from "../../MdiIcon.vue"
    import {mdiCards} from "@mdi/js"
    import balance from "../../../mixins/balance"
    import ChipStack from "../../ChipStack.vue"

    export default {
        name: "PassThePoop",
        components: {ConfirmButton, ChipStack, MdiIcon, PassThePoopParticipants, PlayingCard, PlayerBar},
        mixins: [showError, balance],
        data() {
            return {
                mdiCards,
                error: null,
                cardsLeftInDeck: 52,
                pot: 0,
            }
        },
        computed: {
            ...mapState(['game', 'user']),
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
                this.$store.dispatch('webSocketSend', {action: action.id})
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
                            animate({
                                from: oldPot,
                                to: pot,
                                duration: 500,
                                onUpdate: val => {
                                    this.pot = Math.floor(Math.round(val) / 25) * 25
                                }
                            })
                        }, 1000)
                    }
                },
                immediate: true,
            },
            'gameData.gameState.cardsLeftInDeck': {
                handler: function (newValue, oldValue) {
                    this.cardsLeftInDeck = newValue
                    animate({
                        from: parseInt(oldValue || 52, 10),
                        to: parseInt(newValue, 10),
                        duration: 500,
                        onUpdate: val => {
                            this.cardsLeftInDeck = Math.round(val)
                        }
                    })
                },
                immediate: true,
            },
        },
    }
</script>

<style lang="scss" scoped>
    .pass-the-poop {
        .pot-row {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: $spacing;
            margin-bottom: $spacing;

            .cards-left {
                display: flex;
                flex-direction: column;
                align-items: center;

                span.icon {
                    display: block;
                    width: 21.5px;
                }
            }
        }

        .card {
            @include player-bar-card-size;
            margin: 0 auto;
        }

        .buttons {
            white-space: nowrap;
            width: min-content;
            margin: 0 auto;
        }
    }

    .card-enter-active, .card-leave-active {
        transition: all 500ms;
    }

    .card-enter-from, .card-leave-to {
        opacity: 0;
        transform: translateY(-100%);
    }
</style>
