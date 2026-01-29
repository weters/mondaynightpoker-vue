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
    computed: {
        ...mapGetters({
            phase: 'guts/phase',
            isShowdown: 'guts/isShowdown',
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
        statusClass() {
            if (this.isShowdown) {
                if (this.playerDecision === true) return 'in'
                if (this.playerDecision === false) return 'out'
            }
            if (this.participant.decided) return 'decided'
            return 'waiting'
        },
        statusText() {
            if (this.isShowdown) {
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
    @include card;
    padding: $spacing-medium;
    max-width: 250px;
    transition: border-color 300ms, box-shadow 300ms;

    &.is-winner {
        border-color: $light-green;
        box-shadow: 0 0 10px rgba($light-green, 0.3);
    }

    &.is-loser {
        border-color: $red;
        box-shadow: 0 0 10px rgba($red, 0.3);
    }

    .hand {
        .cards {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-gap: 4px;

            &.cards-3 {
                grid-template-columns: repeat(3, 1fr);
            }
        }
    }

    .metadata {
        display: grid;
        grid-template-columns: 1fr auto;
        justify-items: start;
        align-items: center;
        margin-top: $spacing-small;
        gap: $spacing-small;

        .name {
            font-weight: bold;
            grid-column: 1;
        }

        &.disconnected .name {
            color: $text-color-light;
            font-weight: normal;
            font-style: italic;
        }

        .balance {
            grid-column: 2;
            font-size: 0.9em;
            color: $text-color-light;
        }

        .status-badge {
            grid-column: 1 / -1;
            font-size: 0.75em;
            padding: 2px 8px;
            border-radius: $border-radius;
            text-transform: uppercase;
            font-weight: bold;

            &.waiting {
                background: $background-color;
                color: $text-color-light;
            }

            &.decided {
                background: $primary;
                color: white;
            }

            &.in {
                background: $light-green;
                color: white;
            }

            &.out {
                background: $text-color-light;
                color: white;
            }
        }
    }
}
</style>
