<template>
    <div :class="{ 'player-bar': true, 'is-turn': isTurn }" ref="bar">
        <slider>
            <div class="settings">
                <p>Game balance: {{ formatAmount(gameData.balance) }}</p>
                <p>Table balance: {{ formatAmount(userClientState.balance) }}</p>
                <p><label class="optional"><span>Sit out</span><input type="checkbox" v-model="sitOut"
                                                                      :disabled="sitOutLoading"/></label></p>

                <template v-if="isTableAdmin || canRestart || canTerminate">
                    <h3>Admin</h3>

                    <div class="buttons">
                        <template v-if="confirmRestart">
                            <button class="secondary" @click="confirmRestart=false">Cancel</button>
                            <button @click="newBourreGame">Yes, Restart</button>
                        </template>
                        <template v-else-if="confirmTerminate">
                            <button class="secondary" @click="confirmTerminate=false">Cancel</button>
                            <button @click="terminateGame">Yes, Terminate</button>
                        </template>
                        <template v-else>
                            <button @click="confirmRestart=true" v-if="canRestart">Restart</button>
                            <button @click="confirmTerminate=true" v-if="canTerminate">Terminate</button>
                        </template>
                    </div>
                </template>
            </div>
        </slider>
        <template v-if="folded">
            You folded
        </template>
        <template v-else>
            <bourre-discard v-if="isTradeInRound" :hand="hand" @error="showError"/>
            <bourre-hand v-else :hand="hand" @error="showError"/>
        </template>

        <p class="game-info">
            <span class="round">
                <strong>Round:</strong>
                <span>{{ roundText }}</span>
            </span>
            <span class="turn">
                <strong>Turn:</strong>
                <span>{{ currentTurn }}</span>
            </span>
        </p>
        <transition name="player-bar-error">
            <error :message="error" v-if="error" class="error"/>
        </transition>
    </div>
</template>

<script>
    import BourreHand from "@/components/games/bourre/BourreHand"
    import BourreDiscard from "@/components/games/bourre/BourreDiscard"
    import {mapGetters} from "vuex"
    import Error from "@/components/Error"
    import Slider from "@/components/Slider"
    import balance from "@/mixins/balance"
    import audioplayer from "@/audioplayer"

    export default {
        name: "BourrePlayerBar",
        components: {Slider, Error, BourreDiscard, BourreHand},
        mixins: [balance],
        data() {
            return {
                error: null,
                sitOut: !this.$store.getters.userClientState.active,
                sitOutLoading: false,
                confirmRestart: false,
                confirmTerminate: false,
            }
        },
        computed: {
            ...mapGetters({
                isTradeInRound: 'bourre/isTradeInRound',
                hand: 'bourre/hand',
                folded: 'bourre/folded',
                isTurn: 'bourre/isTurn',
                round: 'bourre/round',
                gameState: 'bourre/gameState',
                gameData: 'bourre/gameData',
                userClientState: 'userClientState',
                isTableAdmin: 'isTableAdmin',
                canRestart: 'canRestart',
                canTerminate: 'canTerminate',
            }),
            roundText() {
                return this.round === 0 ? 'Play/Fold' : this.round
            },
            currentTurn() {
                if (!this.gameState.currentTurn) {
                    return
                }

                return this.$store.getters.playerDataById(this.gameState.currentTurn).player.displayName
            },
        },
        mounted() {
            this.$watch(() => this.$refs.bar.offsetHeight, newVal => {
                document.querySelector('main').style.paddingBottom = `${newVal + 20}px`
            }, {immediate: true})

            // give time for images to load
            setTimeout(() => {
                document.querySelector('main').style.paddingBottom = `${this.$refs.bar.offsetHeight + 20}px`
            }, 100)
        },

        watch: {
            sitOut(sitOut) {
                if (this.sitOutLoading) {
                    return
                }

                this.sitOutLoading = true
                this.$store.state.webSocket.send('playerStatus', null, null, {active: !sitOut})
                    .catch(err => {
                        this.sitOut = !sitOut
                        this.showError(err)
                    })
                    .finally(() => this.sitOutLoading = false)
            },
            isTurn: {
                immediate: true,
                handler(isTurn) {
                    if (isTurn) {
                        audioplayer.queueDing()
                    } else {
                        audioplayer.cancelDing()
                    }
                }
            }
        },
        methods: {
            showError(err) {
                this.error = err
                setTimeout(() => this.error = null, 2000)
            },
            newBourreGame() {
                this.$store.state.webSocket.send('createGame', 'bourre', null, {ante: this.gameState.ante})
                    .then(() => this.confirmRestart = false)
                    .catch(err => this.showError(err))
            },
            terminateGame() {
                this.$store.state.webSocket.send('terminateGame', null, null, {ante: this.gameState.ante})
                    .catch(err => this.showError(err))
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import '../../../variables';

    .player-bar {
        background-color: rgba(darken($background-color, 10%), 0.8);
        position:         fixed;
        bottom:           0;
        left:             0;
        right:            0;
        padding:          $spacing $spacing 0;
        z-index:          100;

        &.is-turn {
            border-top: 5px solid $primary;

            &::before {
                content:     'IT\'S YOUR TURN';
                color:       $primary;
                font-size:   0.7em;
                font-weight: bold;
                display:     block;
                position:    absolute;
                top:         0;
                transform:   translateY(calc(-100% - 5px));
            }
        }

        ::v-deep div.buttons {
            margin: $spacing-medium 0;
        }

        @media(min-width: 400px) {
            & > div:nth-child(2) {
                display:     flex;
                align-items: center;

                & > :first-child {
                    max-width: 500px;
                    width: 100%;
                    margin-right: $spacing;
                }

                & > :nth-child(2) {
                    margin-left:   auto;
                    margin-bottom: 0;
                }
            }
        }
    }

    .error {
        background-color: white;
        position:         absolute;
        bottom:           $spacing-medium;
        right:            0;
        border-radius:    $border-radius 0 0 $border-radius;

        ::v-deep p {
            margin:        0;
            padding:       $spacing-medium;
            border-radius: $border-radius 0 0 $border-radius;
        }
    }

    .player-bar-error-enter-active, .player-bar-error-leave-active {
        transition: transform 500ms;
    }

    .player-bar-error-enter, .player-bar-error-leave-to {
        transform: translateX(100%);
    }

    p.game-info {
        background-color: #333;
        color:            white;
        font-size:        0.9em;
        margin:           $spacing-medium calc(-1 * #{$spacing}) env(safe-area-inset-bottom);
        padding:          $spacing-small $spacing;

        & > span:not(:first-child)::before {
            color:   #bbb;
            content: ' |  ';
        }

        strong::after {
            content: ' ';
        }
    }

    .settings {
        label {
            display:     flex;
            margin:      0;
            align-items: center;

            span {
                order: 2;
            }

            input {
                order:        1;
                margin-right: $spacing-small;
            }
        }

        p:last-child {
            margin-bottom: 0;
        }

        div.buttons {
            margin-bottom: 0;
        }
    }
</style>