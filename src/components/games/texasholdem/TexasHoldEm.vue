<template>
    <div class="texas-hold-em">
        <h3>{{ replaceTokens(gameState.name) }}</h3>

        <poker-pots class="the-poker-pots"/>

        <texas-hold-em-community class="the-community"/>

        <texas-hold-em-participants class="the-participants" :participants="gameState.participants"/>

        <poker-player-bar>
            <div class="hand">
                <playing-card-container :card="cards[0]" v-if="cards"/>
                <playing-card-container :card="cards[1]" v-if="cards"/>
            </div>
        </poker-player-bar>
    </div>
</template>

<script>
import {mapGetters} from "vuex"
import TexasHoldEmCommunity from "@/components/games/texasholdem/TexasHoldEmCommunity"
import PlayingCardContainer from "@/components/PlayingCardContainer"
import TexasHoldEmParticipants from "@/components/games/texasholdem/TexasHoldEmParticipants"
import PokerPlayerBar from "@/components/games/PokerPlayerBar"
import PokerPots from "@/components/games/poker/PokerPots"

export default {
    name: "TexasHoldEm",
    components: {
        PokerPots,
        PokerPlayerBar,
        TexasHoldEmParticipants, PlayingCardContainer, TexasHoldEmCommunity,
    },
    data() {
        return {
            confirm: null,
            hideButtons: false,
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
    },
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