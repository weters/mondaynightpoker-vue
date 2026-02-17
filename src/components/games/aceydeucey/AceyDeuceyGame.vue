<template>
    <div :class="{ 'acey-deucey-game': true, 'is-active': isActive, 'is-mini': mini }">
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
        <div class="bet" v-if="!mini">
            <div>
                <strong>Bet</strong>
                <chip-stack :amount="game.bet.amount"/>
            </div>
            <div class="result" v-if="result">
                <div class="result-text">{{ result }}</div>
                <div v-if="adjustment !== null" :class="{adjustment: true, negative: adjustment < 0}">
                    {{ formatAmount(adjustment) }}
                </div>
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
        mini: {
            type: Boolean,
            default: false,
        },
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

<style lang="scss" scoped>
@import '../../../variables.scss';

div.acey-deucey-game {
    padding: $spacing-small;

    &:not(.is-active) {
        opacity: 0.5;
    }

    &.is-mini {
        padding: 4px;

        div.cards {
            max-width: none;
        }
    }

    div.cards {
        display: flex;
        max-width: 200px;
        margin: 0 auto;

        div.acey-deucey-card {
            flex: 1 1 0;
            min-width: 0;

            &:nth-child(2) {
                margin: 0 $spacing-small;
            }
        }
    }

    div.bet {
        margin-top: $spacing-small;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: $spacing-medium;
        font-size: 0.85em;

        & > div {
            display:        flex;
            align-items:    center;
            gap:            $spacing-small;
        }
    }

    div.result {
        text-align: right;

        div.result-text {
            text-transform: uppercase;
            font-weight:    bold;
            color:          rgba(255, 255, 255, 0.9);
        }

        div.adjustment {
            color: $light-green;

            &.negative {
                color: $red;
            }
        }
    }
}
</style>