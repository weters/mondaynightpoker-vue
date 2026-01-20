<template>
    <div :class="{'seven-card-participant': true, 'is-turn': isTurn }">
        <transition-group class="cards" tag="div" name="hand" v-if="hand.length > 0">
            <div class="card" v-for="(card, i) in hand" :key="i+0">
                <playing-card-container :card="card"/>
            </div>
        </transition-group>
        <div class="cards" v-else>
            <div class="card">
                <playing-card-container :hide-card="true" />
            </div>
        </div>

        <div :class="{ metadata: true, 'disconnected': !playerData.isConnected }">
            <div class="name-hand">
                <strong class="display-name">{{ playerData.player.displayName }}</strong>
                <span class="balance">{{ participant.balance > 0 ? formatAmount(participant.balance) : '(All-in)' }}</span>
                <span v-if="participant.handRank" :class="{'hand-rank': true, 'is-winner': isWinner}">{{ participant.handRank }}</span>
                <span v-else-if="lastAction" class="last-action">{{ lastAction }}</span>
            </div>
        </div>

        <div class="chips">
            <chip-stack :amount="chipStack" />
        </div>

        <dealer-button
            class="dealer-button"
            v-if="participant.playerId === gameState.dealerId"
        />
    </div>
</template>

<script>
    import PlayingCardContainer from "../../PlayingCardContainer"
    import {mapGetters} from "vuex"
    import ChipStack from "../../ChipStack"
    import DealerButton from "../poker/DealerButton"
    import balance from "@/mixins/balance"

    export default {
        name: "SevenCardParticipant",
        components: {DealerButton, ChipStack, PlayingCardContainer},
        mixins: [balance],
        props: {
            participant: {
                type: Object,
                required: true,
            },
        },
        data() {
            return {
                hand: [],
                dealDelay: 200,
            }
        },
        computed: {
            ...mapGetters({
                gameState: 'poker/gameState',
            }),
            order() {
                return this.gameState.participants.findIndex(p => p.playerId === this.participant.playerId)
            },
            numParticipants() {
                return this.gameState.participants.length
            },
            playerData() {
                return this.$store.getters.playerDataById(this.participant.playerId)
            },
            isTurn() {
                return this.gameState.currentTurn === this.participant.playerId
            },
            isWinner() {
                return this.gameState.winners && Object.prototype.hasOwnProperty.call(
                    this.gameState.winners, this.participant.playerId
                )
            },
            lastAction() {
                const lastAction = this.gameState.lastAction
                if (!lastAction) {
                    return ''
                }
                if (lastAction.playerId === this.participant.playerId) {
                    return lastAction.action.name
                }
                return ''
            },
            chipStack() {
                if (this.gameState.winners) {
                    return this.isWinner ? this.gameState.winners[this.participant.playerId] : 0
                }

                return this.participant.currentBet
            }
        },
        mounted() {
            if (this.gameState.round <= 1) {
                if (this.participant.hand) {
                   this.hand = this.participant.hand.slice(0, 1)
                }

                this.timeout = setTimeout(this.addCardToHand, 250 + this.order * this.dealDelay)
            } else {
                this.hand = this.participant.hand || []
            }
        },
        methods: {
            addCardToHand() {
                this.timeout = null

                if (!this.participant.hand) {
                    return
                }

                const shownLength = this.hand.length
                const actualLength = this.participant.hand.length

                if (shownLength === actualLength) {
                    this.hand = this.participant.hand
                    return
                }

                this.hand = [...this.participant.hand.slice(0, shownLength+1)]
                if (shownLength + 1 < actualLength) {
                    this.timeout = setTimeout(this.addCardToHand, this.numParticipants * this.dealDelay)
                }
            }
        },
        beforeDestroy() {
            if (this.timeout) {
                clearTimeout(this.timeout)
            }
        },
        watch: {
            'participant.hand': {
                handler(newHand) {
                    if (!newHand) {
                        this.hand = []
                        return
                    }

                    if (!this.timeout) {
                        const addCardToHand = this.addCardToHand.bind(this)
                        this.timeout = setTimeout(() => addCardToHand(), this.order * this.dealDelay)
                    }
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../../variables.scss';

    $max-width: 599px;

    div.seven-card-participant {
        border: 1px solid $border-color;
        padding:   $spacing-small;
        display: flex;
        flex-wrap: wrap;
        position: relative;

        &.is-turn {
            @include current-turn;
        }

        .dealer-button {
            position: absolute;
            top: $spacing-small;
            right: $spacing-small;
        }

        div.cards {
            display:  flex;
            position: relative;
            flex: 0 0 100%;

            & > div.card {
                flex: 0 1 50px;

                &:not(:first-child) {
                    margin-left: 2px;
                }
            }
        }

        .chips {
            margin-left: auto;
            margin-top: $spacing-small;
        }

        div.metadata {
            flex: 1 1 50%;
            display:    flex;
            flex-wrap:  wrap;
            margin-top: $spacing-small;

            strong.display-name {
                font-weight: normal;
            }

            span.balance {
                display: block;
                margin: 0;
                color: $text-color-light;
                font-size: 0.7em;
            }

            &.disconnected {
                font-style: italic;
                color: $text-color-light;
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

            .last-action {
                display: block;
                font-size: 0.9em;
                color: $text-color-light;
                font-style: italic;
            }
        }
    }

    .hand-enter-active {
        transition: all 250ms;
    }

    .hand-enter {
        transform: translateY(-100%);
        opacity:   0;
    }
</style>