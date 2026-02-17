<template>
    <div :class="{'acey-deucey-player': true, 'is-turn': isTurn, 'is-connected': playerData.isConnected }">
        <p class="display-name"><strong>{{ playerData.player.displayName }}</strong></p>
        <div class="balance">
            {{ formatAmount(balance) }}
        </div>
    </div>
</template>

<script>
import balance from "@/mixins/balance"
import {animate} from "popmotion"

export default {
    name: "AceyDeuceyPlayer",
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
            balance: 0,
        }
    },
    computed: {
        isTurn() {
            return this.$store.getters["aceyDeucey/gameState"].currentTurn === this.participant.playerId
        },
    },
    watch: {
        'participant.balance': {
            handler(newBalance, oldBalance) {
                animate({
                    from: oldBalance || 0,
                    to: newBalance,
                    duration: 500,
                    onUpdate: val => {
                        this.balance = Math.round(val)
                    }
                })
            },
            immediate: true,
        },
    },
}
</script>

<style lang="scss" scoped>
@import '../../../variables.scss';

div.acey-deucey-player {
    @include felt-seat;
    text-align: center;

    &.is-turn {
        @include felt-seat-active;
    }

    p {
        margin: 0;
    }

    p.display-name strong {
        @include felt-seat-name;
    }

    .balance {
        @include felt-seat-balance;
    }

    &:not(.is-connected) {
        p.display-name strong {
            @include felt-seat-disconnected;
        }
    }
}
</style>