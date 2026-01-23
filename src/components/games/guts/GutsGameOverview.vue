<template>
    <div class="guts-game-overview">
        <chip-stack :amount="pot"/>

        <div class="game-info">
            <div class="info-item">
                <span class="label">Round</span>
                <span class="value">{{ round }}</span>
            </div>
            <div class="info-item">
                <span class="label">Phase</span>
                <span class="value">{{ phaseDisplay }}</span>
            </div>
            <div class="info-item">
                <span class="label">Ante</span>
                <span class="value">{{ formatAmount(ante) }}</span>
            </div>
            <div class="info-item">
                <span class="label">Max Owed</span>
                <span class="value">{{ formatAmount(maxOwed) }}</span>
            </div>
        </div>

        <div class="showdown-result" v-if="showdownResult">
            <template v-if="showdownResult.allFolded">
                <p class="all-folded">Everyone folded! Pot carries over to next round.</p>
            </template>
            <template v-else>
                <p class="winners" v-if="showdownResult.winnerIds && showdownResult.winnerIds.length > 0">
                    <strong>Winner{{ showdownResult.winnerIds.length > 1 ? 's' : '' }}:</strong>
                    {{ winnerNames }}
                    <span class="pot-won">(won {{ formatAmount(showdownResult.potWon) }})</span>
                </p>
                <p class="losers" v-if="showdownResult.loserIds && showdownResult.loserIds.length > 0">
                    <strong>Loser{{ showdownResult.loserIds.length > 1 ? 's' : '' }}:</strong>
                    {{ loserNames }}
                    <span class="penalty">(paid {{ formatAmount(showdownResult.penaltyPaid) }} each)</span>
                </p>
                <p class="next-pot" v-if="showdownResult.nextPot > 0">
                    Next pot: {{ formatAmount(showdownResult.nextPot) }}
                </p>
            </template>
        </div>
    </div>
</template>

<script>
import {mapGetters} from "vuex"
import ChipStack from "@/components/ChipStack.vue"
import balance from "@/mixins/balance"

export default {
    name: "GutsGameOverview",
    components: {ChipStack},
    mixins: [balance],
    computed: {
        ...mapGetters({
            pot: 'guts/pot',
            round: 'guts/round',
            phase: 'guts/phase',
            ante: 'guts/ante',
            maxOwed: 'guts/maxOwed',
            showdownResult: 'guts/showdownResult',
        }),
        phaseDisplay() {
            const phases = {
                'dealing': 'Dealing',
                'declaration': 'Declaration',
                'showdown': 'Showdown',
                'roundEnd': 'Round Over',
                'gameOver': 'Game Over',
            }
            return phases[this.phase] || this.phase
        },
        winnerNames() {
            if (!this.showdownResult || !this.showdownResult.winnerIds) return ''
            return this.showdownResult.winnerIds.map(id => this.getPlayerName(id)).join(', ')
        },
        loserNames() {
            if (!this.showdownResult || !this.showdownResult.loserIds) return ''
            return this.showdownResult.loserIds.map(id => this.getPlayerName(id)).join(', ')
        },
    },
    methods: {
        getPlayerName(playerId) {
            const playerData = this.$store.getters.playerDataById(playerId)
            return playerData ? playerData.player.displayName : 'Unknown'
        },
    },
}
</script>

<style lang="scss" scoped>
@import '../../../variables.scss';

div.guts-game-overview {
    text-align: center;
    margin-bottom: $spacing;

    .chip-stack {
        margin: 0 auto;
    }

    .game-info {
        display: flex;
        justify-content: center;
        gap: $spacing;
        margin: $spacing-medium 0;
        flex-wrap: wrap;

        .info-item {
            background: $background-color;
            padding: $spacing-small $spacing-medium;
            border-radius: $border-radius;

            .label {
                font-size: 0.8em;
                color: $text-color-light;
                display: block;
            }

            .value {
                font-weight: bold;
            }
        }
    }

    .showdown-result {
        @include card;
        padding: $spacing;
        margin-top: $spacing-medium;
        text-align: center;

        p {
            margin: $spacing-small 0;

            &.all-folded {
                color: $text-color-light;
                font-style: italic;
            }

            &.winners {
                color: $light-green;
            }

            &.losers {
                color: $red;
            }

            .pot-won, .penalty {
                font-size: 0.9em;
                opacity: 0.8;
            }

            &.next-pot {
                font-weight: bold;
                margin-top: $spacing-medium;
            }
        }
    }
}
</style>
