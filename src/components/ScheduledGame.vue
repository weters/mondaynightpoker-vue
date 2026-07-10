<template>
  <div class="scheduled-game">
    <h3>Game Scheduled</h3>

    <div class="content">
      <div class="info">
        <p class="game">
          <strong>{{ replaceTokens(info.name) }}</strong> starts in <strong>{{ t }}</strong>
        </p>
        <p class="ante">
          {{ formatAmount(info.ante) }}
        </p>
        <p class="started-by">
          {{ player }}
        </p>
      </div>

      <toggle
        v-model="localActive"
        label="Deal me in!"
        @change="$emit('setPlayerActive', $event)"
      />

      <div class="buttons">
        <button
          v-if="canStart"
          type="button"
          class="secondary"
          @click="$emit('cancel')"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script>
    import {mapState} from "pinia"
    import balance from "../mixins/balance"
    import Toggle from "@/components/formelements/Toggle.vue"
    import {useRootStore} from "@/store"

    export default {
        name: "ScheduledGame",
        components: {Toggle},
        mixins: [balance],
        props: {
            info: {
                type: Object,
                required: true,
            },
            canStart: Boolean,
            isPlayerActive: Boolean,
        },
        emits: ['cancel', 'setPlayerActive'],
        data() {
            return {
                t: new Date(this.info.start) - new Date(),
                localActive: this.isPlayerActive,
            }
        },
        computed: {
            ...mapState(useRootStore, ['playerDataById']),
            player() {
                return this.playerDataById(this.info.playerId).player.displayName
            },
        },
        watch: {
            isPlayerActive(newVal) {
                this.localActive = newVal
            },
        },
        mounted() {
            const update = () => {
                const diff = new Date(this.info.start) - new Date()
                this.t = Math.round(diff / 1000)
                if (this.t < 0) {
                    this.t = 0
                } else {
                    setTimeout(update, 250)
                }
            }

            setTimeout(update, 0)
        },
    }
</script>

<style lang="scss" scoped>
    .scheduled-game {
        background-color: $surface-card;
        border-radius:    $radius-md;
        padding:          $space-5;
        color:            $ink;

        h3 {
            margin:         0 0 $space-3 0;
            border-bottom:  none;
            padding-bottom: 0;
            @include section-header;
            font-size: $fs-xs;
        }

        .content {
            display:     flex;
            flex-wrap:   wrap;
            align-items: center;
            gap:         $space-2 $space-4;

            div.info {
                order: 1;
                flex:  1 1 25%;

                p + p {
                    margin-top: $space-1;
                }
            }

            div.buttons {
                flex:         0 0 auto;
                margin-left:  auto;
                padding-left: $space-4;
                order:        2;
            }

            label {
                order: 3;
                flex:  0 0 100%;
                width: auto;
            }
        }

        p {
            margin: 0;
        }

        .game {
            @include numeric;

            strong {
                font-weight: $fw-semibold;
                color:       $primary;
            }
        }

        .ante {
            @include numeric;
            font-weight: $fw-semibold;
            color:       $ink;

            &::before {
                font-weight: $fw-regular;
                color:       $ink-muted;
                content:     'Ante: ';
            }
        }

        .started-by {
            font-weight: $fw-semibold;

            &::before {
                font-weight: $fw-regular;
                color:       $ink-muted;
                content:     'Started by: ';
            }
        }
    }

    .buttons {
        margin: 0;
    }

    label {
        display:     flex;
        align-items: center;
        margin-top:  $space-3;

        input {
            order: 1;
        }

        span {
            order:       2;
            margin-left: $space-3;
        }
    }
</style>