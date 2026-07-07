<template>
    <div :class="{ 'player-bar': true, 'is-turn': isTurn }" ref="bar">
        <div class="bar-content">
            <div class="cards-area" v-if="$slots.cards">
                <slot name="cards"></slot>
            </div>
            <div class="actions-area" v-if="$slots.actions">
                <slot name="actions"></slot>
            </div>
        </div>

        <p class="game-info">
            <span class="turn-badge" v-if="isTurn">YOUR TURN</span>
            <slot name="gameInfo"></slot>
            <span class="help-trigger" v-if="gameRules.length" @click="rulesOpen = true">
                <svg viewBox="0 0 24 24" width="20" height="20"><path :d="mdiHelpCircleOutline" fill="currentColor"/></svg>
            </span>
            <span class="settings-trigger" @click="settingsOpen = true">
                <svg viewBox="0 0 24 24" width="20" height="20"><path :d="mdiCog" fill="currentColor"/></svg>
            </span>
        </p>

        <transition name="player-bar-error">
            <mnp-error :message="combinedError" v-if="combinedError" class="error"/>
        </transition>

        <settings-bottom-sheet :open="settingsOpen" @close="settingsOpen = false">
            <div class="settings">
                <div class="balance-display">
                    <span class="balance-label">Table balance</span>
                    <span class="balance-amount">{{ formatAmount(userClientState.balance) }}</span>
                </div>

                <p>
                    <toggle label="Deal me in!" v-model="dealMeIn" :disabled="dealMeInLoading"/>
                </p>
                <p>
                    <toggle label="Mute sounds" v-model="muteSounds"/>
                </p>

                <slot name="settings"></slot>

                <template v-if="isTableAdmin || canTerminate">
                    <h3>Admin</h3>
                    <div class="buttons">
                        <confirm-button
                            v-if="canTerminate"
                            label="Terminate"
                            confirm-text="Confirm Terminate?"
                            danger
                            @confirmed="terminateGame"
                        />
                    </div>
                </template>
            </div>
        </settings-bottom-sheet>

        <settings-bottom-sheet :open="rulesOpen" @close="rulesOpen = false">
            <div class="rules">
                <h3>How to Play</h3>
                <div v-for="section in gameRules" :key="section.title" class="rule-section">
                    <h4>{{ section.title }}</h4>
                    <p>{{ section.body }}</p>
                </div>
            </div>
        </settings-bottom-sheet>
    </div>
</template>

<script>
import MnpError from "@/components/Error.vue"
import Toggle from "@/components/formelements/Toggle.vue"
import SettingsBottomSheet from "@/components/SettingsBottomSheet.vue"
import ConfirmButton from "@/components/ConfirmButton.vue"
import playerBarShared from "@/mixins/playerBarShared"
import {mdiCog, mdiHelpCircleOutline} from '@mdi/js'

export default {
    name: "PlayerBar",
    mixins: [playerBarShared],
    components: {ConfirmButton, SettingsBottomSheet, Toggle, MnpError},
    props: {
        isTurn: Boolean,
        error: [String, Error],
    },
    data() {
        return {
            mdiCog,
            mdiHelpCircleOutline,
            settingsOpen: false,
            rulesOpen: false,
        }
    },
    computed: {
        combinedError() {
            return this.localError || this.error
        },
        gameRules() {
            return this.$store.getters.gameRules
        },
    },
    mounted() {
        const main = document.querySelector('main')
        if (main && this.$refs.bar) {
            main.style.paddingBottom = `${this.$refs.bar.offsetHeight + 8}px`
        }
    },
    watch: {
        dealMeIn(active) {
            this.toggleDealMeIn(active)
        },
    },
}
</script>

<style lang="scss" scoped>
@use 'sass:color';
.player-bar {
    background:              rgba(255, 255, 255, 0.15);
    backdrop-filter:         blur(10px);
    -webkit-backdrop-filter: blur(10px); /* Safari */
    border-top:              2px solid rgba(255, 255, 255, 0.3);

    position:                fixed;
    bottom:                  0;
    left:                    0;
    right:                   0;
    z-index:                 100;

    &.is-turn {
        box-shadow: 0 -2px 12px rgba($primary, 0.3);
    }
}

.bar-content {
    display:     flex;
    align-items: center;
    padding:     $spacing-small $spacing-medium;
    gap:         $spacing-medium;
    flex-wrap:   wrap;

    .cards-area {
        flex:      1 1 auto;
        min-width: 0;
    }

    .actions-area {
        flex:            1 1 100%;
        min-width:       0;
        display:         flex;
        justify-content: center;
    }

    // Compact buttons inside the bar
    :deep(button:not(.icon):not(.chip-pill)) {
        padding:   5px 12px;
        font-size: 0.85em;
    }

    :deep(div.buttons) {
        margin: 0;
    }
}

.error {
    background-color: white;
    position:         absolute;
    bottom:           100%;
    right:            0;
    margin-bottom:    4px;
    border-radius:    $border-radius;
    box-shadow:       $shadow-md;

    :deep(p) {
        margin:        0;
        padding:       $spacing-small $spacing-medium;
        border-radius: $border-radius;
    }
}

.player-bar-error-enter-active, .player-bar-error-leave-active {
    transition: transform 300ms ease, opacity 300ms ease;
}

.player-bar-error-enter-from, .player-bar-error-leave-to {
    transform: translateY(8px);
    opacity:   0;
}

p.game-info {
    background-color: #333;
    color:            white;
    font-size:        0.75em;
    margin:           0;
    padding:          2px $spacing-medium;
    padding-bottom:   calc(2px + env(safe-area-inset-bottom));
    display:          flex;
    align-items:      center;
    gap:              $spacing-small;
    line-height:      1.4;

    :deep(strong)::after {
        content: ' ';
    }
}

.turn-badge {
    background:    $primary;
    color:         white;
    font-size:     0.8em;
    font-weight:   bold;
    padding:       1px 5px;
    border-radius: $border-radius-small;
    margin-right:  $spacing-small;
    animation:     badge-pulse 2s ease-in-out infinite;
}

@keyframes badge-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
}

.help-trigger,
.settings-trigger {
    cursor:      pointer;
    opacity:     0.7;
    padding:     10px 6px;
    margin:      -10px 0;
    display:     flex;
    align-items: center;

    &:hover {
        opacity: 1;
    }

    &::before {
        display: none !important;
    }
}

.help-trigger {
    margin-left: auto;
}

.balance-display {
    display:        flex;
    flex-direction: column;
    gap:            2px;
    background:     linear-gradient(135deg, rgba(white, 0.06) 0%, rgba($peach, 0.08) 100%);
    border:         1px solid rgba(white, 0.1);
    border-radius:  $border-radius;
    padding:        $spacing-medium;
    margin:         $spacing 0;

    .balance-label {
        font-size:      0.7em;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color:          rgba(white, 0.45);
        font-weight:    600;
    }

    .balance-amount {
        font-size:      1.2em;
        font-weight:    700;
        color:          $peach;
        letter-spacing: -0.01em;
    }
}

.rules {
    h3 {
        margin:      0 0 $spacing;
        font-size:   1.1em;
        color:       white;
        font-weight: 600;
    }

    .rule-section {
        margin-bottom: $spacing;

        h4 {
            margin:      0 0 4px;
            font-size:   0.9em;
            color:       rgba(white, 0.85);
            font-weight: 600;
        }

        p {
            margin:      0;
            font-size:   0.85em;
            color:       rgba(white, 0.6);
            line-height: 1.5;
        }
    }
}

</style>
