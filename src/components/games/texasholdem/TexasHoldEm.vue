<template>
    <div class="texas-hold-em">
        <h3>{{ replaceTokens(gameState.name) }}</h3>

        <poker-pots class="the-poker-pots"/>

        <texas-hold-em-community class="the-community"/>

        <texas-hold-em-participants class="the-participants" :participants="gameState.participants"/>

        <poker-player-bar :selected-cards="selectedCards">
            <div :class="`hand hand-${numHoleCards}`">
                <template v-for="i in numHoleCards">
                    <texas-hold-em-hole-card
                        :key="`${cards[i-1].rank}.${cards[i-1].suit}`"
                        :card="cards[i-1]"
                        v-if="cards && cards.length >= i" :selected="selected === i-1"
                        @selected="updateSelected(i-1, $event)"
                    />
                </template>
            </div>
        </poker-player-bar>
    </div>
</template>

<script>
import {mapGetters} from "vuex"
import TexasHoldEmCommunity from "@/components/games/texasholdem/TexasHoldEmCommunity"
import TexasHoldEmParticipants from "@/components/games/texasholdem/TexasHoldEmParticipants"
import PokerPlayerBar from "@/components/games/PokerPlayerBar"
import PokerPots from "@/components/games/poker/PokerPots"
import TexasHoldEmHoleCard from "@/components/games/texasholdem/TexasHoldEmHoleCard"

export default {
    name: "TexasHoldEm",
    components: {
        TexasHoldEmHoleCard,
        PokerPots,
        PokerPlayerBar,
        TexasHoldEmParticipants,
        TexasHoldEmCommunity,
    },
    data() {
        return {
            confirm: null,
            hideButtons: false,
            selected: null,
        }
    },
    computed: {
        ...mapGetters({
            gameState: 'texasHoldEm/gameState',
            activeParticipant: 'texasHoldEm/activeParticipant',
        }),
        cards() {
            return this.activeParticipant && this.activeParticipant.cards
        },
        numHoleCards() {
            return this.gameState.variant.holeCards
        },
        selectedCards() {
            if (this.selected === null) {
                return
            }

            return [this.cards[this.selected]]
        },
        canDiscard() {
            const actions = this.$store.getters["poker/actions"] || []
            const futureActions = this.$store.getters["poker/futureActions"] || []

            return [
                ...actions,
                ...futureActions,
            ].findIndex(action => action.id === 'discard') >= 0
        }
    },
    methods: {
        updateSelected(card, isSelected) {
            if (!this.canDiscard) {
                return
            }

            if (!isSelected) {
                this.selected = null
                return
            }

            this.selected = card
        }
    },
    watch: {
        canDiscard: {
            handler(canDiscard) {
                if (!canDiscard) {
                    this.selected = null
                }
            },
            immediate: true,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../../variables';

.texas-hold-em {
    .the-community {
        max-width: 500px;
        margin:    0 auto $spacing-medium;
    }

    .the-poker-pots {
        margin-bottom:   $spacing-medium;
        justify-content: center;
        flex-direction:  row;
    }

    .the-participants {
        margin-top: $spacing;
    }

    .player-bar {
        & > div {
            display:     flex;
            align-items: center;

            div.hand {
                display:               grid;
                grid-template-columns: repeat(2, minmax(50px, 100px));
                grid-gap:              $spacing-medium;

                &.hand-3 {
                    grid-template-columns: repeat(3, minmax(50px, 100px));
                }
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