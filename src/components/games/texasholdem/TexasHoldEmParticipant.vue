<template>
    <div :class="classes">
        <div class="cards">
            <playing-card-container :card="card(0)" :hide-card="participant.folded"/>
            <playing-card-container :card="card(1)" :hide-card="participant.folded"/>
        </div>

        <span class="name">{{ playerData.player.displayName }}</span>
        <span class="balance">{{ formatAmount(participant.balance) }}</span>

        <chip-stack :amount="participant.winnings || participant.bet" class="chip-stack"/>

        <div class="info">
            <span class="hand" v-if="participant.hand">{{ participant.hand }}</span>
            <span class="last-action" v-else-if="lastAction">{{ lastAction }}</span>
            <span class="void" v-else></span>
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
    $root:          &;
    border:         1px solid $border-color;
    padding:        $spacing-small;
    display:        flex;
    flex-direction: column;

    &.current-turn {
        @include current-turn;
    }

    div.cards {
        display:               grid;
        grid-template-columns: 1fr 1fr;
        grid-gap:              2px;
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
            padding: 4px;
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

}
</style>