<template>
  <div class="guts-decision">
    <!-- After player has made a local decision, show disabled button -->
    <template v-if="localDecision !== null">
      <div class="buttons decision-buttons">
        <button
          v-if="localDecision"
          class="in-button"
          disabled
        >
          I'm In
        </button>
        <button
          v-if="!localDecision"
          class="out-button"
          disabled
        >
          I'm Out
        </button>
      </div>
      <p class="waiting-others">
        Waiting for others...
      </p>
    </template>
    <!-- Cannot decide yet (waiting for round to start) -->
    <template v-else-if="!canDecide">
      <p class="waiting">
        Waiting...
      </p>
    </template>
    <!-- Show decision buttons -->
    <template v-else>
      <div class="buttons decision-buttons">
        <confirm-button
          class="in-button"
          label="I'm In"
          confirm-text="Confirm In?"
          @confirmed="decide(true)"
        />
        <confirm-button
          class="out-button"
          label="I'm Out"
          confirm-text="Confirm Out?"
          @confirmed="decide(false)"
        />
      </div>
    </template>
  </div>
</template>

<script>
import {mapState, mapActions} from "pinia"
import {useRootStore} from "@/store"
import {useGutsStore} from "@/store/guts"
import ConfirmButton from "@/components/ConfirmButton.vue"

export default {
    name: "GutsDecision",
    components: {ConfirmButton},
    emits: ['error'],
    data() {
        return {
            localDecision: null,
        }
    },
    computed: {
        ...mapState(useGutsStore, ['canDecide', 'hasDecided']),
    },
    watch: {
        canDecide(canDecide) {
            if (canDecide) {
                this.localDecision = null
            }
        },
    },
    methods: {
        ...mapActions(useRootStore, ['webSocketSend']),
        decide(goIn) {
            this.webSocketSend({action: 'decide', additionalData: {in: goIn}})
                .then(() => {
                    this.localDecision = goIn
                })
                .catch(err => {
                    this.$emit('error', err)
                })
        },
    },
}
</script>

<style lang="scss" scoped>
@use 'sass:color';
.guts-decision {
    text-align: center;

    .waiting {
        color: $on-felt-muted;
        font-style: italic;
        margin: 0;
    }

    .waiting-others {
        color: $on-felt-muted;
        font-style: italic;
        font-size: $fs-sm;
        margin: 0;
    }

    .buttons {
        display: flex;
        gap: $spacing-small;
        justify-content: center;

        &.decision-buttons {
            button, :deep(.confirm-button) {
                min-width: 80px;
                font-weight: $fw-semibold;
            }
        }
    }

    .in-button,
    :deep(.in-button:not(.confirming)) {
        background: $positive;
        border-color: $positive;

        &:hover {
            background: color.adjust($positive, $lightness: -8%);
            border-color: color.adjust($positive, $lightness: -8%);
        }
    }

    .out-button,
    :deep(.out-button:not(.confirming)) {
        background: $mnp-neutral-700;
        border-color: $mnp-neutral-700;

        &:hover {
            background: color.adjust($mnp-neutral-700, $lightness: -8%);
            border-color: color.adjust($mnp-neutral-700, $lightness: -8%);
        }
    }

    .in-button:disabled,
    .out-button:disabled {
        opacity: 0.4;
        cursor: not-allowed;

        &:hover {
            background: inherit;
            border-color: inherit;
        }
    }

    .in-button:disabled {
        background: $positive;
        border-color: $positive;
    }

    .out-button:disabled {
        background: $mnp-neutral-700;
        border-color: $mnp-neutral-700;
    }
}
</style>
