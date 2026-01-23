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
        <!-- Confirmation for In -->
        <template v-else-if="confirmIn">
            <p class="confirm-prompt">Go IN?</p>
            <div class="buttons">
                <button class="secondary" @click="confirmIn=false">Cancel</button>
                <button class="in-button" @click="decide(true)">Yes, I'm In!</button>
            </div>
        </template>
        <!-- Confirmation for Out -->
        <template v-else-if="confirmOut">
            <p class="confirm-prompt">Go OUT?</p>
            <div class="buttons">
                <button class="secondary" @click="confirmOut=false">Cancel</button>
                <button class="out-button" @click="decide(false)">Yes, I'm Out</button>
            </div>
        </template>
        <!-- Show decision buttons -->
        <template v-else>
            <div class="buttons decision-buttons">
                <button class="in-button" @click="confirmIn=true">I'm In</button>
                <button class="out-button" @click="confirmOut=true">I'm Out</button>
            </div>
        </template>
    </div>
</template>

<script>
import {mapGetters} from "vuex"

export default {
    name: "GutsDecision",
    data() {
        return {
            confirmIn: false,
            confirmOut: false,
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
            // Reset confirmations and local decision when ability to decide changes
            if (canDecide) {
                // New round started, reset everything
                this.localDecision = null
            }
            this.confirmIn = false
            this.confirmOut = false
        },
    },
    methods: {
        decide(goIn) {
            this.$store.state.webSocket.send('decide', null, null, {in: goIn})
                .then(() => {
                    this.localDecision = goIn
                    this.confirmIn = false
                    this.confirmOut = false
                })
                .catch(err => {
                    this.$emit('error', err)
                    this.confirmIn = false
                    this.confirmOut = false
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
    margin-bottom: $spacing-medium;

    .waiting {
        color: $text-color-light;
        font-style: italic;
        margin: 0;
    }

    .my-decision {
        font-size: 1.2em;
        font-weight: bold;
        margin: 0 0 $spacing-small;

        &.in {
            color: $light-green;
        }

        &.out {
            color: $text-color-light;
        }
    }

    .waiting-others {
        color: $text-color-light;
        font-style: italic;
        font-size: 0.9em;
        margin: 0;
    }

    .confirm-prompt {
        font-weight: bold;
        margin: 0 0 $spacing-small;
    }

    .buttons {
        display: flex;
        gap: $spacing-small;
        justify-content: center;

        &.decision-buttons {
            button {
                min-width: 100px;
                padding: $spacing-medium $spacing;
                font-size: 1.1em;
                font-weight: bold;
            }
        }
    }

    .in-button {
        background: $light-green;
        border-color: $light-green;

        &:hover {
            background: color.adjust($light-green, $lightness: -10%);
            border-color: color.adjust($light-green, $lightness: -10%);
        }
    }

    .out-button {
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
