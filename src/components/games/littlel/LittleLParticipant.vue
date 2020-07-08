<template>
    <div :class="{ 'little-l-participant': true, 'is-action': isAction }">
        <div :class="{cards: true, 'did-fold': participant.didFold}">
            <div v-for="(card, i) in cards" :key="i">
                <playing-card-container :card="card"/>
            </div>
        </div>

        <div class="metadata">
            <div class="name-hand">
                <strong class="display-name">{{ playerData.player.displayName }}</strong>
                <span v-if="participant.handRank" :class="{'hand-rank': true, 'is-winner': isWinner}">{{ participant.handRank }}</span>
            </div>
            <chip-stack :amount="chipStack" class="metadata-chip-stack"/>
        </div>
    </div>
</template>

<script>
    import PlayingCardContainer from "../../PlayingCardContainer"
    import {mapGetters} from "vuex"
    import balance from "../../../mixins/balance"
    import ChipStack from "../../ChipStack"

    export default {
        name: "LittleLParticipant",
        components: {ChipStack, PlayingCardContainer},
        mixins: [balance],
        props: {
            participant: {
                type: Object,
                required: true,
            },
        },
        computed: {
            ...mapGetters({
                gameState: 'littleL/gameState',
            }),
            isAction() {
                return this.participant.playerId === this.gameState.action
            },
            playerData() {
                return this.$store.getters.playerDataById(this.participant.playerId)
            },
            cards() {
                if (!this.participant.hand || this.participant.didFold) {
                    const hand = []
                    for (let i = 0; i < this.gameState.initialDeal; i++) {
                        hand.push(null)
                    }

                    return hand
                }

                return this.participant.hand
            },
            isWinner() {
                return this.gameState.winners.indexOf(this.participant.playerId) >= 0
            },
            chipStack() {
                if (this.gameState.winners.length > 0) {
                    return this.isWinner ? this.participant.balance : 0
                }

                return this.participant.currentBet
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import '../../../variables.scss';

    div.little-l-participant {
        border-top:    5px solid transparent;
        padding-top:   5px;
        border-radius: $border-radius;

        &.is-action {
            border-top-color: $yellow;
        }

        div.cards {
            display: flex;
            margin:  -5px;

            & > * {
                flex:   1 1 100px;
                margin: 5px;
            }

            &.did-fold {
                filter:  brightness(0);
                opacity: 0.2;
            }
        }

        div.metadata {
            display:    flex;
            flex-wrap:  wrap;
            margin-top: $spacing-medium;

            strong.display-name {
                font-weight: normal;
            }

            .hand-rank {
                display:     block;
                font-size:   1.2em;
                color: $text-color-light;

                &.is-winner {
                    font-weight: bold;
                    color: black;
                }
            }

            .metadata-chip-stack {
                margin-left: auto;

                @media(max-width: 599px) {
                    margin-top: $spacing-medium;
                    flex: 0 0 100%;
                }
            }
        }
    }
</style>