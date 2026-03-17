<template>
    <player-bar :error="error" :is-turn="canDecide || canTrade">
        <template #cards>
            <template v-if="isGameOver">
                <p class="game-over-message">Game Over!</p>
            </template>
            <template v-else>
                <guts-hand
                    :hand="hand"
                    :card-count="cardCount"
                    :hidden-cards="hiddenCards"
                    :can-select="canSelectCards"
                    :folded="isTradePhase && myDecision === false"
                    v-model="selectedCards"
                />
            </template>
        </template>

        <template #actions>
            <template v-if="!isGameOver">
                <guts-decision v-if="isDeclarationPhase" @error="showError"/>
                <guts-trade
                    v-if="isTradePhase && myDecision"
                    :selected-cards="selectedCards"
                    @error="showError"
                    @clear-selection="clearSelection"
                />
                <div v-if="isTradePhase && myDecision === false" class="folded-message">
                    <p>You folded this round</p>
                </div>
            </template>
        </template>

        <template #gameInfo>
            {{ handRank }}
        </template>
    </player-bar>
</template>

<script>
import PlayerBar from "@/components/games/PlayerBar.vue"
import GutsHand from "@/components/games/guts/GutsHand.vue"
import GutsDecision from "@/components/games/guts/GutsDecision.vue"
import GutsTrade from "@/components/games/guts/GutsTrade.vue"
import {mapGetters} from "vuex"

export default {
    name: "GutsPlayerBar",
    components: {PlayerBar, GutsDecision, GutsHand, GutsTrade},
    data() {
        return {
            error: null,
            hiddenCards: 0,
            selectedCards: [],
        }
    },
    computed: {
        ...mapGetters({
            hand: 'guts/hand',
            handRank: 'guts/handRank',
            isDeclarationPhase: 'guts/isDeclarationPhase',
            isTradePhase: 'guts/isTradePhase',
            isGameOver: 'guts/isGameOver',
            canDecide: 'guts/canDecide',
            canTrade: 'guts/canTrade',
            cardCount: 'guts/cardCount',
            myTraded: 'guts/myTraded',
            hasTraded: 'guts/hasTraded',
            myDecision: 'guts/myDecision',
        }),
        canSelectCards() {
            return this.isTradePhase && !this.hasTraded
        },
    },
    watch: {
        myTraded(newVal) {
            if (newVal > 0) {
                this.hiddenCards = newVal
                setTimeout(() => {
                    this.hiddenCards = 0
                }, 500)
            }
        },
        isTradePhase(newVal) {
            if (!newVal) {
                this.selectedCards = []
            }
        },
    },
    methods: {
        showError(err) {
            this.error = err
            setTimeout(() => this.error = null, 2000)
        },
        clearSelection() {
            this.selectedCards = []
        },
    },
}
</script>

<style lang="scss" scoped>
@import '../../../variables';

.game-over-message {
    text-align: center;
    font-size: 1.2em;
    font-weight: bold;
    color: $primary;
    margin: 0;
}

.folded-message {
    text-align: center;

    p {
        color: $text-color-light;
        font-style: italic;
        margin: 0;
    }
}
</style>
