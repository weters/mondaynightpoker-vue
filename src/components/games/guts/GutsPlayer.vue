<template>
    <div :class="playerClasses">
        <div class="hand">
            <div :class="['cards', `cards-${cardCount}`]">
                <template v-for="i in cardCount" :key="`playing-card-${i}`">
                    <playing-card-container
                        :hide-card="hideCard(i)"
                        :card="getCard(i)"
                    />
                </template>
            </div>
        </div>

        <div :class="{ metadata: true, disconnected: !playerData.isConnected }">
            <span class="name">{{ playerData.player.displayName }}</span>
            <span class="balance">{{ formatAmount(participant.balance) }}</span>
            <span class="status-badge" :class="statusClass">{{ statusText }}</span>
        </div>
    </div>
</template>

<script>
import {mapGetters} from "vuex"
import balance from '@/mixins/balance'
import PlayingCardContainer from "@/components/PlayingCardContainer.vue"

export default {
    name: "GutsPlayer",
    components: {PlayingCardContainer},
    mixins: [balance],
    props: {
        participant: {
            type: Object,
            required: true,
        },
        playerData: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            hiddenCards: 0,
        }
    },
    watch: {
        'participant.traded'(newVal) {
            if (newVal > 0) {
                this.hiddenCards = newVal
                setTimeout(() => {
                    this.hiddenCards = 0
                }, 500)
            }
        },
    },
    computed: {
        ...mapGetters({
            phase: 'guts/phase',
            isShowdown: 'guts/isShowdown',
            isTradePhase: 'guts/isTradePhase',
            decisions: 'guts/decisions',
            showdownResult: 'guts/showdownResult',
            cardCount: 'guts/cardCount',
        }),
        playerDecision() {
            if (!this.decisions) return null
            return this.decisions[this.participant.playerId]
        },
        isWinner() {
            if (!this.showdownResult || !this.showdownResult.winnerIds) return false
            return this.showdownResult.winnerIds.includes(this.participant.playerId)
        },
        isLoser() {
            if (!this.showdownResult || !this.showdownResult.loserIds) return false
            return this.showdownResult.loserIds.includes(this.participant.playerId)
        },
        wentIn() {
            if (!this.showdownResult || !this.showdownResult.playersInIds) return false
            return this.showdownResult.playersInIds.includes(this.participant.playerId)
        },
        playerClasses() {
            return {
                'guts-player': true,
                'is-winner': this.isWinner,
                'is-loser': this.isLoser,
            }
        },
        showDecisions() {
            return this.isShowdown || this.isTradePhase
        },
        isFolded() {
            return this.showDecisions && this.playerDecision === false
        },
        statusClass() {
            if (this.showDecisions) {
                if (this.playerDecision === true) return 'in'
                if (this.playerDecision === false) return 'out'
            }
            if (this.participant.decided) return 'decided'
            return 'waiting'
        },
        statusText() {
            if (this.showDecisions) {
                if (this.playerDecision === true) return 'IN'
                if (this.playerDecision === false) return 'OUT'
            }
            if (this.participant.decided) return 'Decided'
            return 'Waiting...'
        },
    },
    methods: {
        hideCard(index) {
            // Hide cards if no cards in hand
            if (this.participant.cardsInHand < index) return true
            // Hide traded cards during animation (index is 1-based)
            if (this.hiddenCards > 0 && index > this.cardCount - this.hiddenCards) return true
            // Hide cards for players who folded during trade phase
            if (this.isFolded) return true
            // During declaration phase, show card backs
            if (!this.isShowdown) return false
            // After showdown, only show cards for players who went "In"
            return !this.wentIn
        },
        getCard(index) {
            // Only show actual cards during showdown for "In" players
            if (!this.isShowdown) return null
            if (!this.wentIn) return null
            if (!this.participant.hand) return null
            return this.participant.hand[index - 1] || null
        },
    },
}
</script>

<style lang="scss" scoped>
@import '../../../variables.scss';

div.guts-player {
    @include felt-seat;

    &.is-winner {
        @include felt-seat-won;
    }

    &.is-loser {
        @include felt-seat-lost;
    }

    .hand {
        .cards {
            display: flex;
            gap: 2px;

            & > * {
                flex: 1 1 0;
                min-width: 0;
            }
        }
    }

    .metadata {
        display: grid;
        grid-template-columns: 1fr auto;
        justify-items: start;
        align-items: center;
        margin-top: 3px;
        gap: 2px;

        .name {
            @include felt-seat-name;
            grid-column: 1;
        }

        &.disconnected .name {
            @include felt-seat-disconnected;
        }

        .balance {
            @include felt-seat-balance;
            grid-column: 2;
        }

        .status-badge {
            grid-column: 1 / -1;
            font-size: 0.65em;
            padding: 1px 6px;
            border-radius: 3px;
            text-transform: uppercase;
            font-weight: bold;

            &.waiting {
                background: rgba(255, 255, 255, 0.1);
                color: rgba(255, 255, 255, 0.4);
            }

            &.decided {
                background: rgba(255, 255, 255, 0.15);
                color: rgba(255, 255, 255, 0.7);
            }

            &.in {
                background: rgba($light-green, 0.3);
                color: $light-green;
            }

            &.out {
                background: rgba(255, 255, 255, 0.1);
                color: rgba(255, 255, 255, 0.4);
            }
        }
    }
}
</style>
