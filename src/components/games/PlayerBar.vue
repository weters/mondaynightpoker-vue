<template>
    <div :class="{ 'player-bar': true, 'is-turn': isTurn }" ref="bar">
        <slider>
            <div class="settings">
                <p>Table balance: {{ formatAmount(userClientState.balance) }}</p>

                <p><toggle label="Deal me in!" v-model="dealMeIn" :disabled="dealMeInLoading" /></p>

                <template v-if="isTableAdmin || canTerminate">
                    <h3>Admin</h3>

                    <div class="buttons">
                        <template v-if="confirmTerminate">
                            <button class="secondary" @click="confirmTerminate=false">Cancel</button>
                            <button @click="terminateGame">Yes, Terminate</button>
                        </template>
                        <template v-else>
                            <button @click="confirmTerminate=true" v-if="canTerminate">Terminate</button>
                        </template>
                    </div>
                </template>
            </div>
        </slider>

        <slot></slot>

        <p class="game-info">
            <slot name="gameInfo"></slot>
        </p>
        <transition name="player-bar-error">
            <mnp-error :message="combinedError" v-if="combinedError" class="error"/>
        </transition>
    </div>
</template>

<script>
import MnpError from "@/components/Error"
import Slider from "@/components/Slider"
import {mapGetters} from "vuex"
import balance from "../../mixins/balance"
import audioplayer from "@/audioplayer"
import Toggle from "@/components/formelements/Toggle"

export default {
    name: "PlayerBar",
    mixins: [balance],
    components: {Toggle, Slider, MnpError},
    props: {
        isTurn: Boolean,
        error: [String, Error],
    },
    data() {
        return {
            localError: null,
            dealMeIn: this.$store.getters.userClientState.active,
            dealMeInLoading: false,
            confirmTerminate: false,
        }
    },
    computed: {
        ...mapGetters({
            isTableAdmin: 'isTableAdmin',
            canTerminate: 'canTerminate',
            userClientState: 'userClientState',
        }),
        combinedError() {
            return this.localError || this.error
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
        dealMeIn(active) {
            if (this.dealMeInLoading) {
                return
            }

            this.dealMeInLoading = true
            this.$store.state.webSocket.send('playerStatus', null, null, {active})
                .catch(err => {
                    this.dealMeIn = !active
                    this.showError(err)
                })
                .finally(() => this.dealMeInLoading = false)
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
        },
    },
    methods: {
        showError(err) {
            this.localError = err
            setTimeout(() => this.localError = null, 2000)
        },
        terminateGame() {
            this.$store.state.webSocket.send('terminateGame')
                .catch(err => this.showError(err))
        },
    },
}
</script>

<style lang="scss" scoped>
@import '../../variables';

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