<template>
  <div :class="{ 'acey-deucey-game': true, 'is-active': isActive }">
    <div class="cards">
      <div class="acey-deucey-card">
        <playing-card-container
          :card="game.firstCard"
          :hide-card="!game.firstCard"
        />
        <div class="card-state">
          {{ formattedAceState }}
        </div>
      </div>
      <div class="acey-deucey-card">
        <playing-card-container
          :card="game.middleCard"
          :hide-card="!game.middleCard"
        />
        <div class="card-state" />
      </div>
      <div class="acey-deucey-card">
        <playing-card-container
          :card="game.lastCard"
          :hide-card="!game.lastCard"
        />
        <div class="card-state" />
      </div>
    </div>
    <div class="bet">
      <div>
        <p><strong>Bet</strong></p>
        <chip-stack :amount="game.bet.amount" />
      </div>
    </div>
    <div
      v-if="result"
      class="result"
    >
      <div class="result-text">
        {{ result }}
      </div>
      <div
        v-if="adjustment !== null"
        :class="{adjustment: true, negative: adjustment < 0}"
      >
        {{ formatAmount(adjustment) }}
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from "pinia"
import {useAceyDeuceyStore} from "@/store/aceyDeucey"
import PlayingCardContainer from "@/components/PlayingCardContainer.vue"
import ChipStack from "@/components/ChipStack.vue"
import audioplayer from "@/audioplayer"
import balance from "@/mixins/balance"

export default {
    name: "AceyDeuceyGame",
    components: {ChipStack, PlayingCardContainer},
    mixins: [balance],
    props: {
        game: {
            type: Object,
            required: true,
        },
        isActive: Boolean,
    },
    data() {
        return {
            result: null,
            adjustment: null,
        }
    },
    computed: {
        ...mapState(useAceyDeuceyStore, ['config']),
        aceState() {
            if (this.game.firstCard) {
                const bitField = this.game.firstCard.bitField
                for (let entry of Object.entries(this.config.cardBitFields)) {
                    if (bitField & entry[0]) {
                        return entry[1]
                    }
                }
            }

            return ""
        },
        formattedAceState() {
            switch (this.aceState) {
                case 'undecided':
                    return 'Low or High'
                case 'low':
                    return 'Low'
                case 'high':
                    return 'High'
            }

            return ''
        },
    },
    watch: {
        'game.result': {
            immediate: true,
            handler: function (result, oldResult) {
                // immediate callback, just show the result
                if (typeof oldResult === 'undefined') {
                    this.result = result
                } else {
                    setTimeout(() => {
                        this.result = result
                        if (result === 'post') {
                            audioplayer.playPost()
                        }
                    }, 750)
                }
            },
        },
        'game.adjustment': {
            immediate: true,
            handler: function (adjustment, oldAdjustment) {
                // if oldAdjustment is undefined, then it's coming from an immediate callback
                if (typeof oldAdjustment === 'undefined') {
                    this.adjustment = adjustment
                } else {
                    setTimeout(() => {
                        this.adjustment = adjustment
                    }, 750)
                }
            },
        },
    },
}
</script>

<style lang="scss" scoped>
div.acey-deucey-game {
    background:            $felt-rail;
    border:                1px solid $felt-hairline;
    border-radius:         $radius-md;
    box-shadow:            $shadow-felt-sm;
    color:                 $on-felt;
    display:               grid;
    grid-template-columns: 1fr 1fr;
    padding:               $space-3;
    transition:            box-shadow $dur-normal $ease-standard,
                           border-color $dur-normal $ease-standard,
                           opacity $dur-normal $ease-standard;

    &.is-active {
        @include current-turn;
    }

    &:not(.is-active) {
        opacity: 0.55;
        filter:  grayscale(0.3);
    }

    div.cards {
        display:     flex;
        grid-column: 1 / span 2;

        div.acey-deucey-card {
            flex: 1 1 125px;

            &:nth-child(2) {
                margin: 0 $space-3;
            }

            div.card-state {
                text-align:     center;
                margin-top:     $space-1;
                min-height:     1.2em;
                font-size:      $fs-xs;
                font-weight:    $fw-semibold;
                text-transform: uppercase;
                letter-spacing: $tracking-wide;
                color:          $on-felt-muted;
            }
        }
    }

    div.bet {
        & > div {
            display:          flex;
            flex-direction:   column;
            align-items:      center;
            width: min-content;

            p {
                margin:         0 0 $space-1;
                font-size:      $fs-2xs;
                font-weight:    $fw-semibold;
                text-transform: uppercase;
                letter-spacing: $tracking-caps;
                color:          $on-felt-muted;
            }
        }
    }

    div.result {
        justify-self: flex-end;
        align-self:   center;
        text-align:   right;

        div.result-text {
            text-transform: uppercase;
            font-weight:    $fw-bold;
            font-size:      $fs-sm;
            letter-spacing: $tracking-wide;
            color:          $gold-soft;
        }

        div.adjustment {
            @include numeric;
            font-weight: $fw-semibold;
            color:       $positive;

            &.negative {
                color: $negative;
            }
        }
    }
}

@media (prefers-reduced-motion: reduce) {
    div.acey-deucey-game {
        transition: none;
    }
}
</style>