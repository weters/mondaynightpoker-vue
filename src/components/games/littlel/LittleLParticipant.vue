<template>
    <div class="little-l-participant">
        <div :class="{cards: true, 'did-fold': participant.didFold}">
            <div v-for="(card, i) in cards" :key="i">
                <playing-card-container :card="card"/>
            </div>
        </div>

        <div class="metadata">
            <strong class="display-name">{{ playerData.player.displayName }}</strong>
            <span v-if="participant.handRank" class="hand-rank">{{ participant.handRank }}</span>
            <mdi-icon class="is-action" :icon="mdiPokerChip" v-if="isAction"/>
        </div>
    </div>
</template>

<script>
    import PlayingCardContainer from "../../PlayingCardContainer"
    import {mapGetters} from "vuex"
    import MdiIcon from "../../MdiIcon"
    import {mdiPokerChip} from "@mdi/js"

    export default {
        name: "LittleLParticipant",
        components: {MdiIcon, PlayingCardContainer},
        props: {
            participant: {
                type: Object,
                required: true,
            },
        },
        data() {
            return {
                mdiPokerChip,
            }
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
        },
    }
</script>

<style lang="scss" scoped>
    div.cards {
        display: flex;
        margin:  -5px;

        & > * {
            flex:   1 1 100px;
            margin: 5px;
        }

        &.did-fold {
            filter: brightness(0);
            opacity: 0.2;
        }
    }

    .is-action {
        display: block;
        width: 18px;
    }

    span.hand-rank {
        display: block;
    }
</style>