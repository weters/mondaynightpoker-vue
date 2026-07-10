<template>
  <div :class="{'acey-deucey-player': true, 'is-turn': isTurn, 'is-connected': playerData.isConnected }">
    <p class="display-name">
      <strong>{{ playerData.player.displayName }}</strong>
    </p>
    <div class="balance">
      {{ formatAmount(balance) }}
    </div>
  </div>
</template>

<script>
import {mapState} from "pinia"
import {useAceyDeuceyStore} from "@/store/aceyDeucey"
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
        ...mapState(useAceyDeuceyStore, ['gameState']),
        isTurn() {
            return this.gameState.currentTurn === this.participant.playerId
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
div.acey-deucey-player {
    background:     $felt-rail;
    border:         1px solid $felt-hairline;
    border-radius:  $radius-sm;
    box-shadow:     $shadow-felt-sm;
    color:          $on-felt;
    padding:        $space-2 $space-3;
    min-width:      120px;
    transition:     box-shadow $dur-normal $ease-standard, border-color $dur-normal $ease-standard;

    &.is-turn {
        @include current-turn;
    }

    p {
        margin: 0;
    }

    p.display-name {
        font-size:     $fs-sm;
        font-weight:   $fw-semibold;
        color:         $on-felt;
        white-space:   nowrap;
        overflow:      hidden;
        text-overflow: ellipsis;
    }

    div.balance {
        @include numeric;
        color:      $on-felt-muted;
        font-size:  $fs-xs;
        margin-top: 2px;
    }

    &:not(.is-connected) {
        p.display-name strong {
            font-weight: $fw-regular;
            font-style:  italic;
            color:       $on-felt-faint;
        }
    }
}

@media (prefers-reduced-motion: reduce) {
    div.acey-deucey-player {
        transition: box-shadow $dur-fast linear, border-color $dur-fast linear;
    }
}
</style>