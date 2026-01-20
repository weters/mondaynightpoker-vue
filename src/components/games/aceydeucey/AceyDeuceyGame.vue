<template>
    <div :class="{ 'acey-deucey-game': true, 'is-active': isActive }">
        <div class="cards">
            <div class="acey-deucey-card">
                <playing-card-container :card="game.firstCard" :hide-card="!game.firstCard"/>
                <div class="card-state">{{ formattedAceState }}</div>
            </div>
            <div class="acey-deucey-card">
                <playing-card-container :card="game.middleCard" :hide-card="!game.middleCard"/>
                <div class="card-state"></div>
            </div>
            <div class="acey-deucey-card">
                <playing-card-container :card="game.lastCard" :hide-card="!game.lastCard"/>
                <div class="card-state"></div>
            </div>
        </div>
        <div class="bet">
            <div>
                <p><strong>Bet</strong></p>
                <chip-stack :amount="game.bet.amount"/>
            </div>
        </div>
        <div class="result" v-if="result">
            <div class="result-text">{{ result }}</div>
            <div v-if="adjustment !== null" :class="{adjustment: true, negative: adjustment < 0}">
                {{ formatAmount(adjustment) }}
            </div>
        </div>
    </div>
</template>

<script>
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
        aceState() {
            if (this.game.firstCard) {
                const bitField = this.game.firstCard.bitField
                for (let entry of Object.entries(this.$store.getters["aceyDeucey/config"].cardBitFields)) {
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

<style lang="scss" . scoped>
@import '../../../variables.scss';

div.acey-deucey-game {
    border:                1px solid $border-color;
    display:               grid;
    grid-template-columns: 1fr 1fr;
    padding:               $spacing-medium;

    &.is-active {
        box-shadow: 0 0 5px 2px rgba($orange, 0.25);
    }

    &:not(.is-active) {
        opacity: 0.5;
    }

    div.cards {
        display:     flex;
        grid-column: 1 / span 2;

        div.acey-deucey-card {
            flex: 1 1 125px;

            &:nth-child(2) {
                margin: 0 $spacing-medium;
            }
        }
    }

    div.bet {
        & > div {
            display:          flex;
            flex-direction:   column;
            align-items:      center;
            width: min-content;
        }
    }

    div.result {
        justify-self: flex-end;

        div.result-text {
            text-transform: uppercase;
            font-weight:    bold;
            color:          $secondary;
        }

        div.adjustment {
            &.negative {
                color: $red;
            }
        }
    }
}
</style>