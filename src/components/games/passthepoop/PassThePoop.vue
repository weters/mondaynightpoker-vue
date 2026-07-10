<template>
  <div class="pass-the-poop">
    <h3>Pass the Poop / {{ gameData.gameState.edition }} Edition</h3>

    <div class="pot-row">
      <chip-stack :amount="pot" />
      <div class="cards-left">
        <span class="icon"><mdi-icon :icon="mdiCards" /></span>
        <span class="value">{{ cardsLeftInDeck }}</span>
      </div>
    </div>

    <pass-the-poop-participants :participants="participants" />

    <player-bar
      :error="error"
      :is-turn="isTurn"
    >
      <template #cards>
        <div class="card">
          <transition
            name="card"
            mode="out-in"
          >
            <playing-card
              v-if="card"
              :key="`${card.rank}.${card.suit}`"
              :rank="card.rank"
              :suit="card.suit"
            />
          </transition>
        </div>
      </template>

      <template #actions>
        <div class="buttons">
          <confirm-button
            v-for="a in availableActions"
            :key="a.id"
            :label="a.name"
            :confirm-text="`Confirm ${a.name}?`"
            @confirmed="execute(a)"
          />
        </div>
      </template>

      <template #gameInfo>
        <span class="turn">
          <strong>Turn:</strong>
          <span>{{ currentTurn }}</span>
        </span>
      </template>
    </player-bar>
  </div>
</template>

<script>
    import {mapActions, mapState} from "pinia"
    import {useRootStore} from "@/store"
    import {usePassThePoopStore} from "@/store/passThePoop"
    import PlayerBar from "../PlayerBar.vue"
    import PlayingCard from "../../PlayingCard.vue"
    import PassThePoopParticipants from "./PassThePoopParticipants.vue"
    import ConfirmButton from "@/components/ConfirmButton.vue"
    import showError from "../../../mixins/show_error"
    import {animate} from 'popmotion'
    import MdiIcon from "../../MdiIcon.vue"
    import {mdiCards} from "@mdi/js"
    import balance from "../../../mixins/balance"
    import ChipStack from "../../ChipStack.vue"

    export default {
        name: "PassThePoop",
        components: {ConfirmButton, ChipStack, MdiIcon, PassThePoopParticipants, PlayingCard, PlayerBar},
        mixins: [showError, balance],
        data() {
            return {
                mdiCards,
                error: null,
                cardsLeftInDeck: 52,
                pot: 0,
            }
        },
        computed: {
            ...mapState(useRootStore, ['game', 'user', 'playerDataById']),
            ...mapState(usePassThePoopStore, ['card', 'gameData', 'availableActions', 'isPlayerTurn']),
            isTurn() {
                return this.isPlayerTurn(this.user.player.id)
            },
            currentTurn() {
                return this.gameData.gameState.currentTurn && this.playerDataById(this.gameData.gameState.currentTurn).player.displayName
            },
            participants() {
                return this.gameData.gameState.participants
            },
        },
        watch: {
            'gameData.gameState.allParticipants': {
                handler: function (newValue) {
                    const totalLives = this.gameData.gameState.lives
                    const ante = this.gameData.gameState.ante
                    let pot = 0
                    Object.values(newValue).forEach(p => pot += (totalLives - p.lives) * ante / totalLives)
                    const oldPot = this.pot

                    if (pot !== oldPot) {
                        setTimeout(() => {
                            animate({
                                from: oldPot,
                                to: pot,
                                duration: 500,
                                onUpdate: val => {
                                    this.pot = Math.floor(Math.round(val) / 25) * 25
                                }
                            })
                        }, 1000)
                    }
                },
                immediate: true,
            },
            'gameData.gameState.cardsLeftInDeck': {
                handler: function (newValue, oldValue) {
                    this.cardsLeftInDeck = newValue
                    animate({
                        from: parseInt(oldValue || 52, 10),
                        to: parseInt(newValue, 10),
                        duration: 500,
                        onUpdate: val => {
                            this.cardsLeftInDeck = Math.round(val)
                        }
                    })
                },
                immediate: true,
            },
        },
        methods: {
            ...mapActions(useRootStore, ['webSocketSend']),
            execute(action) {
                this.webSocketSend({action: action.id})
                    .catch(err => this.showError(err))
            },
        },
    }
</script>

<style lang="scss" scoped>
    .pass-the-poop {
        h3 {
            text-align:     center;
            color:          $gold-soft;
            border-bottom:  1px solid $felt-hairline;
            font-weight:    $fw-semibold;
            letter-spacing: $tracking-tight;
        }

        .pot-row {
            display:         flex;
            align-items:     center;
            justify-content: center;
            gap:             $space-6;
            margin-bottom:   $spacing;

            :deep(.chip-stack .amount) {
                font-size:   $fs-xl;
                color:       $gold-soft;
                text-shadow: 0 0 12px rgba($gold, 0.4);
            }

            .cards-left {
                display:        flex;
                flex-direction: column;
                align-items:    center;
                color:          $on-felt-muted;

                span.icon {
                    display: block;
                    width:   21.5px;
                }

                span.value {
                    @include numeric;
                    margin-top:  2px;
                    font-weight: $fw-semibold;
                    color:       $on-felt;
                }
            }
        }

        .card {
            @include player-bar-card-size;
            margin: 0 auto;
        }

        .buttons {
            white-space: nowrap;
            width:       min-content;
            margin:      0 auto;
        }
    }

    .card-enter-active, .card-leave-active {
        transition: transform $dur-slow $ease-standard, opacity $dur-slow $ease-standard;
    }

    .card-enter-from, .card-leave-to {
        opacity:   0;
        transform: translateY(-100%);
    }

    @media (prefers-reduced-motion: reduce) {
        .card-enter-active, .card-leave-active {
            transition: opacity $dur-fast linear;
        }

        .card-enter-from, .card-leave-to {
            transform: none;
        }
    }
</style>
