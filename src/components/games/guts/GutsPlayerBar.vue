<template>
    <player-bar :error="error" :is-turn="canDecide || canTrade">
        <div class="bar">
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

        </div>

        <template v-slot:gameInfo>
            <span class="round"><strong>Round:</strong> {{ round }}</span>
            <span class="phase"><strong>Phase:</strong> {{ phaseDisplay }}</span>
            <span class="pot"><strong>Pot:</strong> {{ formatAmount(pot) }}</span>
        </template>
    </player-bar>
</template>

<script>
import PlayerBar from "@/components/games/PlayerBar.vue"
import GutsHand from "@/components/games/guts/GutsHand.vue"
import GutsDecision from "@/components/games/guts/GutsDecision.vue"
import GutsTrade from "@/components/games/guts/GutsTrade.vue"
import {mapGetters} from "vuex"
import balance from "@/mixins/balance"

export default {
    name: "GutsPlayerBar",
    components: {PlayerBar, GutsDecision, GutsHand, GutsTrade},
    mixins: [balance],
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
            round: 'guts/round',
            pot: 'guts/pot',
            phase: 'guts/phase',
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
        phaseDisplay() {
            const phases = {
                'dealing': 'Dealing',
                'declaration': 'Declaration',
                'tradeIn': 'Trade',
                'showdown': 'Showdown',
                'roundEnd': 'Round Over',
                'gameOver': 'Game Over',
            }
            return phases[this.phase] || this.phase
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

.bar {
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media(max-width: $mobile-max) {
        display: block;

        & > div:last-child {
            margin-top: $spacing-medium;
        }
    }
}

.game-over-message {
    text-align:  center;
    font-size:   1.5em;
    font-weight: bold;
    color:       $primary;
    margin:      $spacing 0;
}

.round, .phase {
    margin-right: $spacing-medium;
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
