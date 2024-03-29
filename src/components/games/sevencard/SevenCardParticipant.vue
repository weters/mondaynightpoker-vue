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
                <span v-if="participant.handRank" :class="{'hand-rank': true, 'is-winner': isWinner}">{{ participant.handRank }}</span>
            </div>
        </div>

        <div class="chips">
            <chip-stack :amount="chipStack" />
        </div>
    </div>
</template>

<script>
    import PlayingCardContainer from "../../PlayingCardContainer"
    import {mapGetters} from "vuex"
    import ChipStack from "../../ChipStack"

    export default {
        name: "SevenCardParticipant",
        components: {ChipStack, PlayingCardContainer},
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
                return this.gameState.winners && this.gameState.winners.indexOf(this.participant.playerId) >= 0
            },
            chipStack() {
                if (this.gameState.winners) {
                    return this.isWinner ? this.participant.balance : 0
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

        &.is-turn {
            @include current-turn;
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