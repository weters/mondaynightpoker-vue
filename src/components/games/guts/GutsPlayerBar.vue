<template>
    <player-bar :error="error" :is-turn="canDecide">
        <div class="bar">
            <template v-if="isGameOver">
                <p class="game-over-message">Game Over!</p>
            </template>
            <template v-else>
                <guts-hand :hand="hand"/>
                <guts-decision v-if="isDeclarationPhase" @error="showError"/>
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
import {mapGetters} from "vuex"
import balance from "@/mixins/balance"

export default {
    name: "GutsPlayerBar",
    components: {PlayerBar, GutsDecision, GutsHand},
    mixins: [balance],
    data() {
        return {
            error: null,
        }
    },
    computed: {
        ...mapGetters({
            hand: 'guts/hand',
            round: 'guts/round',
            pot: 'guts/pot',
            phase: 'guts/phase',
            isDeclarationPhase: 'guts/isDeclarationPhase',
            isGameOver: 'guts/isGameOver',
            canDecide: 'guts/canDecide',
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
    },
    methods: {
        showError(err) {
            this.error = err
            setTimeout(() => this.error = null, 2000)
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
</style>
