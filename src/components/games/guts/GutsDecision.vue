<template>
    <div class="guts-decision">
        <!-- After player has made a local decision, show disabled button -->
        <template v-if="localDecision !== null">
            <div class="buttons decision-buttons">
                <button class="in-button" disabled v-if="localDecision">I'm In</button>
                <button class="out-button" disabled v-if="!localDecision">I'm Out</button>
            </div>
            <p class="waiting-others">Waiting for others...</p>
        </template>
        <!-- Cannot decide yet (waiting for round to start) -->
        <template v-else-if="!canDecide">
            <p class="waiting">Waiting...</p>
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
import {mapGetters} from "vuex"
import ConfirmButton from "@/components/ConfirmButton.vue"

export default {
    name: "GutsDecision",
    components: {ConfirmButton},
    data() {
        return {
            localDecision: null,
        }
    },
    computed: {
        ...mapGetters({
            canDecide: 'guts/canDecide',
            hasDecided: 'guts/hasDecided',
        }),
    },
    watch: {
        canDecide(canDecide) {
            if (canDecide) {
                this.localDecision = null
            }
        },
    },
    methods: {
        decide(goIn) {
            this.$store.state.webSocket.send('decide', null, null, {in: goIn})
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
@import '../../../variables';

.guts-decision {
    text-align: center;

    .waiting {
        color: $text-color-light;
        font-style: italic;
        margin: 0;
    }

    .waiting-others {
        color: $text-color-light;
        font-style: italic;
        font-size: 0.9em;
        margin: 0;
    }

    .buttons {
        display: flex;
        gap: $spacing-small;
        justify-content: center;

        &.decision-buttons {
            button, :deep(.confirm-button) {
                min-width: 80px;
                font-weight: bold;
            }
        }
    }

    .in-button,
    :deep(.in-button:not(.confirming)) {
        background: $light-green;
        border-color: $light-green;

        &:hover {
            background: color.adjust($light-green, $lightness: -10%);
            border-color: color.adjust($light-green, $lightness: -10%);
        }
    }

    .out-button,
    :deep(.out-button:not(.confirming)) {
        background: $text-color-light;
        border-color: $text-color-light;

        &:hover {
            background: color.adjust($text-color-light, $lightness: -10%);
            border-color: color.adjust($text-color-light, $lightness: -10%);
        }
    }

    .in-button:disabled,
    .out-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;

        &:hover {
            background: inherit;
            border-color: inherit;
        }
    }

    .in-button:disabled {
        background: $light-green;
        border-color: $light-green;
    }

    .out-button:disabled {
        background: $text-color-light;
        border-color: $text-color-light;
    }
}
</style>
