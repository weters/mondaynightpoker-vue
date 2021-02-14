<template>
    <div :class="classes">
        <div class="hand">
            <div class="cards">
                <playing-card-container :card="card(0)" :hide-card="participant.folded"/>
                <playing-card-container :card="card(1)" :hide-card="participant.folded"/>
            </div>

            <p class="hand" v-if="participant.hand">{{ participant.hand }}</p>
        </div>
        <div class="meta">
            <p class="name">{{ playerData.player.displayName }} <span
                class="balance">{{ formatAmount(participant.balance) }}</span></p>

            <p class="last-action" v-if="lastAction">{{ lastAction }}</p>

            <chip-stack :amount="participant.winnings || participant.bet" class="chip-stack"/>
        </div>
    </div>
</template>

<script>
import PlayingCardContainer from "@/components/PlayingCardContainer"
import balance from "@/mixins/balance"
import ChipStack from "@/components/ChipStack"

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
            }
        },
    },
    methods: {
        card(index) {
            if (this.participant.cards) {
                return this.participant.cards[index]
            }

            return null
        },
    },
}
</script>

<style lang="scss" scoped>
@import '../../../variables.scss';

div.texas-hold-em-participant {
    $root:   &;
    border:  1px solid $border-color;
    padding: $spacing-medium;

    &.current-turn {
        @include current-turn;
    }

    div.hand {
        position: relative;

        div.cards {
            display:               grid;
            grid-template-columns: 1fr 1fr;
            grid-gap:              2px;
        }

        p.hand {
            color:            white;
            background-color: rgba(black, 0.75);
            padding:          4px;
            position:         absolute;
            margin:           0;
            bottom:           $spacing-small;
            right:            0;

            @at-root #{$root}.won div.hand p.hand {
                font-weight: bold;
                color:       $peach;
            }

            @at-root #{$root}.lost div.hand p.hand {
                color:      rgba(white, 0.5);
                font-size:  0.8em;
                font-style: italic;
            }
        }
    }

    div.meta {
        display:    flex;
        margin-top: $spacing-medium;
        position:   relative;

        p.last-action {
            margin:           0;
            position:         absolute;
            bottom:           0;
            left:             0;
            background-color: $peach;
            padding:          2px 4px;
            font-weight:      bold;
            text-transform:   uppercase;
        }

        .chip-stack {
            margin-left: auto;
        }

        span.balance {
            color: $text-color-light;

            &::before {
                content: '(';
            }

            &::after {
                content: ')';
            }
        }


    }
}
</style>