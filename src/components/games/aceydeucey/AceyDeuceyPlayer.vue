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
import {tween} from "popmotion"

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
                tween({
                    from: oldBalance,
                    to: newBalance,
                    duration: 500,
                })
                    .pipe(Math.round)
                    .start(val => {
                        this.balance = val
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
    border:              0 solid $border-color;
    border-bottom-width: 3px;
    padding:             $spacing-medium;
    margin:              $spacing-medium;

    &.is-turn {
        border-bottom-color: $primary;
    }

    p {
        margin: 0;
    }

    &:not(.is-connected) {
        p.display-name strong {
            font-weight: normal;
            font-style:  italic;
        }
    }
}
</style>