<template>
    <div class="ptp-participant">
        <strong class="name">{{ participant.playerData.player.displayName }}</strong>

        <div class="lives">
            <mdi-icon :icon="mdiPokerChip" />
            <mdi-icon :icon="mdiPokerChip" />
            <mdi-icon :icon="mdiPokerChip" />
        </div>

        <div class="card-container">
            <div class="background"></div>
            <div class="card-back">
                <mdi-icon :icon="mdiCardsPlayingOutline" />
            </div>
        </div>

        <span class="is-turn">
            <mdi-icon :icon="mdiTimerSand" v-if="isPlayerTurn" />
        </span>
    </div>
</template>

<script>
    import MdiIcon from "../../MdiIcon"
    import {mdiCardsPlayingOutline, mdiPokerChip, mdiTimerSand} from '@mdi/js'
    export default {
        name: "PassThePoopParticipant",
        components: {MdiIcon},
        props: {
            participant: {
                type: Object,
                required: true,
            }
        },
        data() {
            return {
                mdiCardsPlayingOutline,
                mdiPokerChip,
                mdiTimerSand,
            }
        },
        computed: {
            isPlayerTurn() {
                return this.$store.getters['passThePoop/isPlayerTurn'](this.participant.playerId)
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../../variables';
    .ptp-participant {
        display: flex;
        flex-direction: column;
        max-width: 100px;
        align-items: center;


        .lives {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-gap: $spacing-medium;
            width: 100%;
        }

        .card-container {
            padding-top: calc(100% * 3.5 / 2.5);
            height: 0;
            position: relative;
            width: 100%;

            & > * {
                position: absolute;
                top:      0;
                right:    0;
                bottom:   0;
                left:     0;
            }

            .background {
                border-radius:    $border-radius;
                box-shadow:       inset 1px 2px 2px rgba(black, 0.1);
                background-color: rgba(black, 0.1);
                border:           1px solid rgba(black, 0.1);
                margin:           2px;
            }

            div.card-back {
                background: linear-gradient($primary, $secondary);
                border-radius: $border-radius;

                svg {
                    fill: white;
                    width: 75%;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }
            }
        }

        span.is-turn {
            display: inline-block;
            width: 25px;
        }
    }
</style>