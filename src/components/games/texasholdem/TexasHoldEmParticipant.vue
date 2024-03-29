<template>
    <div :class="classes">
        <div :class="`cards cards-${numHoleCards}`">
            <template v-for="(_, i) in numHoleCards">
                <playing-card-container
                    :key="i"
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

        <dealer-button
            class="them-dealer-button"
            v-if="participant.playerId === $store.getters['poker/gameState'].dealer"
        />
    </div>
</template>

<script>
import PlayingCardContainer from "@/components/PlayingCardContainer"
import balance from "@/mixins/balance"
import ChipStack from "@/components/ChipStack"
import DealerButton from "@/components/games/poker/DealerButton"

export default {
    name: "TexasHoldEmParticipant",
    components: {DealerButton, ChipStack, PlayingCardContainer},
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
    $root:          &;
    border:         1px solid $border-color;
    padding:        $spacing-small;
    display:        flex;
    flex-direction: column;
    position:       relative;

    &.current-turn {
        @include current-turn;
    }

    &:not(.is-connected) {
        span.name {
            font-style: italic;
            color:      $text-color-light;
        }
    }

    div.cards {
        display:               grid;
        grid-template-columns: 1fr 1fr;
        grid-gap:              2px;

        &.cards-3 {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    span.balance {
        display:   block;
        margin:    0;
        color:     $text-color-light;
        font-size: 0.7em;
    }

    .chip-stack {
        margin-top: auto;
        padding:    $spacing-small 0;
        align-self: center;
    }

    .info {
        & > span {
            font-size: 0.8em;
            padding:   4px;
        }

        .last-action {
            background-color: $peach;
            display:          block;
        }

        .hand {
            display:          block;
            color:            white;
            background-color: rgba(black, 0.75);
            margin:           0;

            @at-root #{$root}.won .info .hand {
                color:            white;
                background-color: $green;
            }

            @at-root #{$root}.lost .info .hand {
                background-color: $dark-green;
                color:            rgba(white, 0.5);
            }
        }

        .void {
            &::after {
                content: '\00a0';
            }
        }
    }

    .them-dealer-button {
        position: absolute;
        bottom:   $spacing-small;
        right:    $spacing-small;
    }
}
</style>