<template>
    <div :class="classes">
        <div :class="`cards cards-${numHoleCards}`">
            <template v-for="(_, i) in numHoleCards" :key="i">
                <playing-card-container
                    :card="card(i)"
                    :hide-card="participant.folded || card(i) === undefined"
                />
            </template>
        </div>

        <span class="name">{{ playerData.player.displayName }}</span>
        <span class="balance">{{ participant.balance > 0 ? formatAmount(participant.balance) : '(All-in)' }}</span>

        <chip-stack :amount="participant.winnings || participant.currentBet" class="chip-stack"/>

        <div class="info">
            <span class="hand" v-if="participant.handRank">{{ participant.handRank }}</span>
            <span class="last-action" v-else-if="lastAction">{{ lastAction }}</span>
            <span class="void" v-else></span>
        </div>

    </div>
</template>

<script>
import PlayingCardContainer from "@/components/PlayingCardContainer.vue"
import balance from "@/mixins/balance"
import ChipStack from "@/components/ChipStack.vue"

export default {
    name: "TexasHoldEmParticipant",
    components: {ChipStack, PlayingCardContainer},
    mixins: [balance],
    props: {
        participant: {
            type: Object,
            required: true,
        },
    },
    computed: {
        numHoleCards() {
            return this.$store.getters["poker/gameState"].variant.holeCards
        },
        lastAction() {
            const lastAction = this.$store.getters["texasHoldEm/gameState"].lastAction
            if (!lastAction) {
                return
            }

            if (lastAction.playerId === this.participant.playerId) {
                return lastAction.action.name
            }

            return ''
        },
        playerData() {
            return this.$store.getters.playerDataById(this.participant.playerId)
        },
        classes() {
            return {
                'texas-hold-em-participant': true,
                'current-turn': this.participant.playerId === this.$store.getters["texasHoldEm/gameState"].currentTurn,
                won: this.participant.result === 'won',
                lost: this.participant.result === 'lost',
                'is-connected': this.playerData.isConnected,
            }
        },
    },
    methods: {
        card(index) {
            if (index < this.participant.cards.length) {
                return this.participant.cards[index]
            }

            return undefined
        },
    },
}
</script>

<style lang="scss" scoped>
@import '../../../variables.scss';

div.texas-hold-em-participant {
    @include felt-seat;
    display:        flex;
    flex-direction: column;

    &.current-turn {
        @include felt-seat-active;
    }

    &.won {
        @include felt-seat-won;
    }

    &.lost {
        @include felt-seat-lost;
    }

    &:not(.is-connected) {
        span.name {
            @include felt-seat-disconnected;
        }
    }

    div.cards {
        display: flex;
        gap: 2px;

        & > * {
            flex: 1 1 0;
            min-width: 0;
        }
    }

    span.name {
        @include felt-seat-name;
        margin-top: 3px;
    }

    span.balance {
        @include felt-seat-balance;
        display: block;
    }

    .chip-stack {
        margin-top: auto;
        padding: 2px 0;
        align-self: center;
    }

    .info {
        & > span {
            font-size: 0.7em;
            padding: 2px 4px;
            border-radius: 3px;
        }

        .last-action {
            background-color: rgba(232, 168, 56, 0.3);
            color: #e8a838;
            display: block;
        }

        .hand {
            display: block;
            color: white;
            background-color: rgba(255, 255, 255, 0.15);
            margin: 0;
        }

        .void {
            &::after {
                content: '\00a0';
            }
        }
    }

}
</style>