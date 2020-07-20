<template>
    <div :class="{'seven-card-participant': true, 'is-turn': isTurn }">
        <transition-group class="cards" tag="div" name="hand">
            <div class="card" v-for="(card, i) in participant.hand" :key="i">
                <playing-card-container :card="card"/>
            </div>
        </transition-group>

        <div :class="{ metadata: true, 'disconnected': !playerData.isConnected }">
            <div class="name-hand">
                <strong class="display-name">{{ playerData.player.displayName }}</strong>
                <span v-if="participant.handRank" :class="{'hand-rank': true, 'is-winner': isWinner}">{{ participant.handRank }}</span>
            </div>
        </div>

        <chip-stack :amount="chipStack" class="participant-chip-stack"/>
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
        computed: {
            ...mapGetters({
                gameState: 'poker/gameState',
            }),
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
    }
</script>

<style lang="scss" scoped>
    @import '../../../variables.scss';

    $max-width: 599px;

    div.seven-card-participant {
        border-radius: $border-radius;
        box-shadow: 0 0 5px rgba(black, 0.2);
        border: 1px solid transparent;
        padding:   $spacing-small;
        display: flex;
        flex-wrap: wrap;

        &.is-turn {
            border-color: $yellow;
            box-shadow: 0 0 5px rgba($yellow, 0.6);
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

        .participant-chip-stack{
            margin-left: auto;
            margin-top: $spacing-small;
            flex: 0 1 100px;
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