<template>
    <div class="texas-hold-em">
        <h3>{{ replaceTokens(gameState.name) }}</h3>

        <texas-hold-em-community class="community"/>

        <div class="pot">
            <chip-stack :amount="animatedPot"/>
        </div>

        <texas-hold-em-participants :participants="gameState.participants"/>

        <player-bar :is-turn="gameState.currentTurn === activeParticipant.playerId">
            <div>
                <div class="hand">
                    <playing-card-container :card="cards[0]" v-if="cards"/>
                    <playing-card-container :card="cards[1]" v-if="cards"/>
                </div>
                <div class="buttons" v-if="!hideButtons">
                    <template v-if="confirm">
                        <button type="button" class="secondary" @click="confirm = null">Cancel
                        </button>
                        <button type="button" @click="executeAction(confirm)">
                            <span>Yes, {{ confirm.name }}</span>
                            <span v-if="confirm.amount">{{ formatAmount(confirm.amount) }}</span>
                        </button>
                    </template>
                    <template v-else>
                        <button type="button" v-for="action in actions" :key="action.id" @click="confirm = action">
                            <span>{{ action.name }}</span>
                            <span v-if="action.amount">{{ formatAmount(action.amount) }}</span>
                        </button>
                    </template>
                </div>
            </div>

            <template v-slot:gameInfo>
                {{ handRank }}
            </template>
        </player-bar>
    </div>
</template>

<script>
import PlayerBar from "@/components/games/PlayerBar"
import {mapGetters, mapState} from "vuex"
import balance from "@/mixins/balance"
import TexasHoldEmCommunity from "@/components/games/texasholdem/TexasHoldEmCommunity"
import PlayingCardContainer from "@/components/PlayingCardContainer"
import TexasHoldEmParticipants from "@/components/games/texasholdem/TexasHoldEmParticipants"
import ChipStack from "@/components/ChipStack"
import {tween} from "popmotion"

export default {
    name: "TexasHoldEm",
    components: {ChipStack, TexasHoldEmParticipants, PlayingCardContainer, TexasHoldEmCommunity, PlayerBar},
    mixins: [balance],
    data() {
        return {
            confirm: null,
            hideButtons: false,
            animatedPot: 0,
        }
    },
    computed: {
        ...mapState(['webSocket']),
        ...mapGetters({
            actions: 'texasHoldEm/actions',
            gameState: 'texasHoldEm/gameState',
            activeParticipant: 'texasHoldEm/activeParticipant',
        }),
        handRank() {
            return this.activeParticipant.hand
        },
        cards() {
            return this.activeParticipant.cards
        },
        pot() {
            return this.gameState.pot
        },
    },
    methods: {
        executeAction(action) {
            this.hideButtons = true
            this.webSocket.send(action.name)
                .catch(err => {
                    this.hideButtons = false
                    this.$store.dispatch('error', err)
                })
                .finally(() => {
                    this.confirm = null
                })
        },
    },
    watch: {
        actions() {
            this.hideButtons = false
        },
        pot: {
            immediate: true,
            handler(pot, oldPot) {
                tween({
                    from: oldPot,
                    to: pot,
                    duration: 500,
                })
                    .pipe(Math.round)
                    .start(val => this.animatedPot = val)
            },
        },
    },
}
</script>

<style lang="scss" scoped>
@import '../../../variables';

.texas-hold-em {
    .community {
        max-width: 500px;
        margin:    0 auto $spacing-medium;
    }

    div.pot > * {
        margin: 0 auto $spacing;
    }

    .player-bar {
        & > div {
            display:     flex;
            align-items: center;

            div.hand {
                display:               grid;
                grid-template-columns: repeat(2, minmax(50px, 100px));
                grid-gap:              $spacing-medium;
            }

            div.buttons {
                margin-left: auto;

                button {
                    span:not(:last-child) {
                        margin-right: $spacing-small;
                    }
                }
            }

            @media(max-width: $mobile-max) {
                display: block;

                div.buttons {
                    margin-top: $spacing-medium;
                }
            }
        }
    }
}
</style>