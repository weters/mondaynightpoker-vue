<template>
    <div class="texas-hold-em">
        <h3>{{ replaceTokens(gameState.name) }}</h3>

        <texas-hold-em-community class="community"/>

        <div class="pot">
            <chip-stack :amount="animatedPot"/>
        </div>

        <texas-hold-em-participants :participants="gameState.participants"/>

        <player-bar :is-turn="isTurn">
            <div>
                <div class="hand">
                    <playing-card-container :card="cards[0]" v-if="cards"/>
                    <playing-card-container :card="cards[1]" v-if="cards"/>
                </div>
                <texas-hold-em-actions />
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
import TexasHoldEmActions from "@/components/games/texasholdem/TexasHoldEmActions"

export default {
    name: "TexasHoldEm",
    components: {
        TexasHoldEmActions,
        ChipStack, TexasHoldEmParticipants, PlayingCardContainer, TexasHoldEmCommunity, PlayerBar},
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
            gameState: 'texasHoldEm/gameState',
            activeParticipant: 'texasHoldEm/activeParticipant',
        }),
        isTurn() {
            return this.activeParticipant && this.gameState.currentTurn == this.activeParticipant.playerId
        },
        handRank() {
            return this.activeParticipant && this.activeParticipant.hand
        },
        cards() {
            return this.activeParticipant && this.activeParticipant.cards
        },
        pot() {
            return this.gameState.pot
        },
    },
    watch: {
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

            & > div:last-child {
                margin-left: auto;
            }

            @media(max-width: $mobile-max) {
                display: block;

                & > div:last-child {
                    margin-top: $spacing-medium;
                }
            }
        }
    }
}
</style>