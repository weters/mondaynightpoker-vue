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

        <!-- Comic-book style effects -->
        <transition name="comic-pop">
            <div v-if="showMushroomEffect" class="comic-effect mushroom-effect">
                Mushroom Card!
            </div>
        </transition>

        <transition name="comic-pop">
            <div v-if="showAntidoteEffect" class="comic-effect antidote-effect">
                Antidote!
            </div>
        </transition>

        <transition name="comic-pop">
            <div v-if="showNoAntidoteEffect" class="comic-effect no-antidote-effect">
                Ah! Mushroom!
            </div>
        </transition>

        <!-- Coupons and Clippings effects -->
        <transition name="comic-pop">
            <div v-if="showBogoEffect" class="comic-effect bogo-effect">
                BOGO!
            </div>
        </transition>

        <transition name="comic-pop">
            <div v-if="showNailClippingRefundEffect" class="comic-effect nailclipping-refund-effect">
                Nail clipping found. Meal comp'd!
            </div>
        </transition>

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
    import PlayingCardContainer from "../../PlayingCardContainer.vue"
    import {mapGetters} from "vuex"
    import ChipStack from "../../ChipStack.vue"
    import DealerButton from "../poker/DealerButton.vue"
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
                // Comic effect state
                showMushroomEffect: false,
                showAntidoteEffect: false,
                showNoAntidoteEffect: false,
                // Track what we've shown to prevent repeats
                lastShownMushroomHolderId: null,
                lastShownAntidotePlayerId: null,
                lastShownNoAntidoteFoldsKey: null,
                // Timeouts for auto-dismiss
                mushroomTimeout: null,
                antidoteTimeout: null,
                noAntidoteTimeout: null,
                // Coupons and Clippings splash state
                showBogoEffect: false,
                showNailClippingRefundEffect: false,
                // Track what we've shown to prevent repeats (Coupons and Clippings)
                lastShownBogoPlayerId: null,
                lastShownNailClippingKey: null,
                // Timeouts for auto-dismiss (Coupons and Clippings)
                bogoTimeout: null,
                nailClippingRefundTimeout: null,
            }
        },
        computed: {
            ...mapGetters({
                gameState: 'poker/gameState',
            }),
            variantState() {
                return this.gameState?.variantState
            },
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
            },
            // Chiggs-specific computed properties
            isMushroomHolder() {
                return this.variantState?.mushroomHolderId === this.participant.playerId
            },
            playedAntidote() {
                return this.variantState?.antidotePlayed?.playerId === this.participant.playerId
            },
            isInMushroomFolds() {
                const folds = this.variantState?.mushroomFolds
                if (!folds || folds.length === 0) return false
                return folds.some(f => f.playerId === this.participant.playerId)
            },
            mushroomFoldsKey() {
                const folds = this.variantState?.mushroomFolds
                if (!folds || folds.length === 0) return null
                return folds.map(f => f.playerId).sort().join(',')
            },
            // Coupons and Clippings computed properties
            isBogoPlayer() {
                return this.variantState?.bogoPlayerId === this.participant.playerId
            },
            isNailClippingRefundPlayer() {
                return this.variantState?.nailClippingPlayerIds?.includes(this.participant.playerId)
            },
            nailClippingPlayerIdsKey() {
                const ids = this.variantState?.nailClippingPlayerIds
                if (!ids || ids.length === 0) return null
                return `${this.gameState.round}:${ids.join(',')}`
            },
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
            },
            showEffect(effectName) {
                const dataKey = `show${effectName}Effect`
                const timeoutKey = `${effectName.toLowerCase()}Timeout`

                // Clear any existing timeout
                if (this[timeoutKey]) {
                    clearTimeout(this[timeoutKey])
                }

                this[dataKey] = true
                this[timeoutKey] = setTimeout(() => {
                    this[dataKey] = false
                    this[timeoutKey] = null
                }, 2000)
            },
        },
        beforeUnmount() {
            if (this.timeout) {
                clearTimeout(this.timeout)
            }
            if (this.mushroomTimeout) {
                clearTimeout(this.mushroomTimeout)
            }
            if (this.antidoteTimeout) {
                clearTimeout(this.antidoteTimeout)
            }
            if (this.noAntidoteTimeout) {
                clearTimeout(this.noAntidoteTimeout)
            }
            // Coupons and Clippings timeouts
            if (this.bogoTimeout) {
                clearTimeout(this.bogoTimeout)
            }
            if (this.nailClippingRefundTimeout) {
                clearTimeout(this.nailClippingRefundTimeout)
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
            },
            // Watch for mushroom holder changes (this participant got the mushroom)
            isMushroomHolder: {
                handler(isHolder) {
                    const holderId = this.variantState?.mushroomHolderId
                    if (isHolder && holderId && holderId !== this.lastShownMushroomHolderId) {
                        this.lastShownMushroomHolderId = holderId
                        this.showEffect('Mushroom')
                    }
                },
                immediate: true,
            },
            // Watch for antidote played by this participant
            playedAntidote: {
                handler(played) {
                    const playerId = this.variantState?.antidotePlayed?.playerId
                    if (played && playerId && playerId !== this.lastShownAntidotePlayerId) {
                        this.lastShownAntidotePlayerId = playerId
                        this.showEffect('Antidote')
                    }
                },
                immediate: true,
            },
            // Watch for this participant being in mushroom folds (no antidote)
            isInMushroomFolds: {
                handler(inFolds) {
                    const key = this.mushroomFoldsKey
                    if (inFolds && key && key !== this.lastShownNoAntidoteFoldsKey) {
                        this.lastShownNoAntidoteFoldsKey = key
                        this.showEffect('NoAntidote')
                    }
                },
                immediate: true,
            },
            // Coupons and Clippings watchers
            isBogoPlayer: {
                handler(isPlayer) {
                    const playerId = this.variantState?.bogoPlayerId
                    if (isPlayer && playerId && playerId !== this.lastShownBogoPlayerId) {
                        this.lastShownBogoPlayerId = playerId
                        // Delay: position-based offset + 250ms card animation
                        setTimeout(() => this.showEffect('Bogo'), this.order * this.dealDelay + 250)
                    }
                },
                immediate: true,
            },
            nailClippingPlayerIdsKey: {
                handler(key) {
                    if (key && this.isNailClippingRefundPlayer && key !== this.lastShownNailClippingKey) {
                        this.lastShownNailClippingKey = key
                        setTimeout(() => this.showEffect('NailClippingRefund'), this.order * this.dealDelay + 250)
                    }
                },
                immediate: true,
            },
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

        // Comic-book style effects
        .comic-effect {
            position: absolute;
            top: -10px;
            left: 50%;
            transform: translateX(-50%);
            max-width: 120px;
            padding: 6px 10px;
            font-size: 0.8em;
            font-weight: bold;
            text-align: center;
            border-radius: 8px;
            z-index: 100;
            pointer-events: none;
            white-space: nowrap;

            // Starburst/jagged edge effect using clip-path
            &::before {
                content: '';
                position: absolute;
                top: -4px;
                left: -4px;
                right: -4px;
                bottom: -4px;
                background: inherit;
                z-index: -1;
                border-radius: 12px;
                opacity: 0.3;
            }
        }

        .mushroom-effect {
            background: linear-gradient(135deg, #8B4513, #551a1a);
            color: white;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
            box-shadow: 0 2px 8px rgba(139, 69, 19, 0.6);
        }

        .antidote-effect {
            background: linear-gradient(135deg, #4CAF50, #1B5E20);
            color: white;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
            box-shadow: 0 2px 8px rgba(76, 175, 80, 0.6);
        }

        .no-antidote-effect {
            background: linear-gradient(135deg, #f44336, #b71c1c);
            color: white;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
            box-shadow: 0 2px 8px rgba(244, 67, 54, 0.6);
        }

        // Coupons and Clippings effects
        .bogo-effect {
            background: linear-gradient(135deg, #FFD700, #FFA500);
            color: #000;
            text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.5);
            box-shadow: 0 2px 8px rgba(255, 215, 0, 0.6);
        }

        .nailclipping-refund-effect {
            background: linear-gradient(135deg, #4CAF50, #1B5E20);
            color: white;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
            box-shadow: 0 2px 8px rgba(76, 175, 80, 0.6);
            max-width: 180px;
            white-space: normal;
        }
    }

    // Hand card animation
    .hand-enter-active {
        transition: all 250ms;
    }

    .hand-enter-from {
        transform: translateY(-100%);
        opacity:   0;
    }

    // Comic pop animation
    .comic-pop-enter-active {
        animation: comic-pop-in 0.3s ease-out;
    }

    .comic-pop-leave-active {
        animation: comic-pop-out 0.2s ease-in;
    }

    @keyframes comic-pop-in {
        0% {
            opacity: 0;
            transform: translateX(-50%) scale(0.3);
        }
        50% {
            transform: translateX(-50%) scale(1.1);
        }
        100% {
            opacity: 1;
            transform: translateX(-50%) scale(1);
        }
    }

    @keyframes comic-pop-out {
        0% {
            opacity: 1;
            transform: translateX(-50%) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateX(-50%) scale(0.5);
        }
    }
</style>
