<template>
  <div
    ref="bar"
    :class="{ 'player-bar': true, 'is-turn': isTurn }"
  >
    <div class="bar-content">
      <div
        v-if="$slots.cards"
        class="cards-area"
      >
        <slot name="cards" />
      </div>
      <div
        v-if="$slots.actions"
        class="actions-area"
      >
        <slot name="actions" />
      </div>
    </div>

    <p class="game-info">
      <span
        v-if="isTurn"
        class="turn-badge"
      >YOUR TURN</span>
      <slot name="gameInfo" />
      <span
        v-if="gameRules.length"
        class="help-trigger"
        role="button"
        tabindex="0"
        aria-label="How to play"
        @click="rulesOpen = true"
        @keydown.enter.prevent="rulesOpen = true"
        @keydown.space.prevent="rulesOpen = true"
      >
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
        ><path
          :d="mdiHelpCircleOutline"
          fill="currentColor"
        /></svg>
      </span>
      <span
        class="settings-trigger"
        role="button"
        tabindex="0"
        aria-label="Settings"
        @click="settingsOpen = true"
        @keydown.enter.prevent="settingsOpen = true"
        @keydown.space.prevent="settingsOpen = true"
      >
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
        ><path
          :d="mdiCog"
          fill="currentColor"
        /></svg>
      </span>
    </p>

    <transition name="player-bar-error">
      <error-message
        v-if="combinedError"
        :message="combinedError"
        class="error"
      />
    </transition>

    <settings-bottom-sheet
      :open="settingsOpen"
      @close="settingsOpen = false"
    >
      <div class="settings">
        <div class="balance-display">
          <span class="balance-label">Table balance</span>
          <span class="balance-amount">{{ formatAmount(userClientState.balance) }}</span>
        </div>

        <p>
          <toggle
            v-model="dealMeIn"
            label="Deal me in!"
            :disabled="dealMeInLoading"
          />
        </p>
        <p>
          <toggle
            v-model="muteSounds"
            label="Mute sounds"
          />
        </p>

        <slot name="settings" />

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

    <settings-bottom-sheet
      :open="rulesOpen"
      @close="rulesOpen = false"
    >
      <div class="rules">
        <h3>How to Play</h3>
        <div
          v-for="section in gameRules"
          :key="section.title"
          class="rule-section"
        >
          <h4>{{ section.title }}</h4>
          <p>{{ section.body }}</p>
        </div>
      </div>
    </settings-bottom-sheet>
  </div>
</template>

<script>
import {useRootStore} from "@/store"
import ErrorMessage from "@/components/ErrorMessage.vue"
import Toggle from "@/components/formelements/Toggle.vue"
import SettingsBottomSheet from "@/components/SettingsBottomSheet.vue"
import ConfirmButton from "@/components/ConfirmButton.vue"
import playerBarShared from "@/mixins/playerBarShared"
import {mdiCog, mdiHelpCircleOutline} from '@mdi/js'

export default {
    name: "PlayerBar",
    components: {ConfirmButton, SettingsBottomSheet, Toggle, ErrorMessage},
    mixins: [playerBarShared],
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
            return useRootStore().gameRules
        },
    },
    watch: {
        dealMeIn(active) {
            this.toggleDealMeIn(active)
        },
    },
    mounted() {
        const main = document.querySelector('main')
        if (main && this.$refs.bar) {
            main.style.paddingBottom = `${this.$refs.bar.offsetHeight + 8}px`
        }
    },
}
</script>

<style lang="scss" scoped>
@use 'sass:color';
.player-bar {
    background:              rgba($felt-rail, 0.72);
    backdrop-filter:         blur(12px);
    -webkit-backdrop-filter: blur(12px); /* Safari */
    border-top:              2px solid $felt-hairline;
    color:                   $on-felt;

    position:                fixed;
    bottom:                  0;
    left:                    0;
    right:                   0;
    z-index:                 $z-player-bar;

    transition: box-shadow $dur-normal $ease-standard, border-color $dur-normal $ease-standard;

    // Current turn — the single most important glance state.
    &.is-turn {
        border-top-color: $accent;
        box-shadow:       0 -2px 16px rgba($orange, 0.4);
    }
}

.bar-content {
    display:     flex;
    align-items: center;
    padding:     $space-2 $spacing-medium;
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

    // Compact buttons inside the bar (still ≥44px hit area via tap-target)
    :deep(button:not(.icon):not(.chip-pill)) {
        @include tap-target;
        padding:   $space-2 $space-3;
        font-size: $fs-sm;
    }

    :deep(div.buttons) {
        margin: 0;
    }
}

.error {
    background-color: $surface-card;
    position:         absolute;
    bottom:           100%;
    right:            0;
    margin-bottom:    $space-1;
    border-radius:    $radius-md;
    box-shadow:       $shadow-md;

    :deep(p) {
        margin:        0;
        padding:       $spacing-small $spacing-medium;
        border-radius: $radius-md;
    }
}

.player-bar-error-enter-active, .player-bar-error-leave-active {
    transition: transform $dur-normal $ease-standard, opacity $dur-normal $ease-standard;
}

.player-bar-error-enter-from, .player-bar-error-leave-to {
    transform: translateY(8px);
    opacity:   0;
}

@media (prefers-reduced-motion: reduce) {
    .player-bar-error-enter-active, .player-bar-error-leave-active {
        transition: opacity $dur-fast linear;
    }

    .player-bar-error-enter-from, .player-bar-error-leave-to {
        transform: none;
    }
}

p.game-info {
    background-color: $felt-base;
    color:            $on-felt-muted;
    font-size:        $fs-xs;
    margin:           0;
    padding:          $space-1 $spacing-medium;
    padding-bottom:   calc(#{$space-1} + env(safe-area-inset-bottom));
    display:          flex;
    align-items:      center;
    gap:              $spacing-small;
    line-height:      $lh-snug;

    :deep(strong)::after {
        content: ' ';
    }
}

.turn-badge {
    background:      $accent;
    color:          $accent-ink;
    font-size:      $fs-2xs;
    font-weight:    $fw-bold;
    text-transform: uppercase;
    letter-spacing: $tracking-wide;
    padding:        2px $space-2;
    border-radius:  $radius-pill;
    margin-right:   $spacing-small;
    box-shadow:     0 0 12px rgba($orange, 0.55);
    animation:      badge-pulse 2s ease-in-out infinite;
}

@keyframes badge-pulse {
    0%, 100% { opacity: 1; box-shadow: 0 0 12px rgba($orange, 0.55); }
    50%      { opacity: 0.72; box-shadow: 0 0 6px rgba($orange, 0.3); }
}

@media (prefers-reduced-motion: reduce) {
    .turn-badge {
        animation: none;
    }
}

.help-trigger,
.settings-trigger {
    cursor:      pointer;
    color:       $on-felt-muted;
    padding:     $space-2 $space-1;
    margin:      -8px 0;
    @include tap-target;
    display:     flex;
    align-items: center;
    justify-content: center;
    border-radius: $radius-xs;

    &:hover {
        color: $on-felt;
    }

    &:focus-visible {
        @include focus-ring-on-felt;
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
    background:     linear-gradient(135deg, rgba(#fff, 0.05) 0%, rgba($peach, 0.09) 100%);
    border:         1px solid $felt-hairline;
    border-radius:  $radius-md;
    padding:        $spacing-medium;
    margin:         $spacing 0;

    .balance-label {
        font-size:      $fs-2xs;
        text-transform: uppercase;
        letter-spacing: $tracking-caps;
        color:          $on-felt-faint;
        font-weight:    $fw-semibold;
    }

    .balance-amount {
        @include numeric;
        font-size:      $fs-lg;
        font-weight:    $fw-bold;
        color:          $gold-soft;
    }
}

.rules {
    h3 {
        margin:      0 0 $spacing;
        font-size:   $fs-lg;
        color:       $on-felt;
        font-weight: $fw-semibold;
    }

    .rule-section {
        margin-bottom: $spacing;

        h4 {
            margin:      0 0 $space-1;
            font-size:   $fs-sm;
            color:       $on-felt;
            font-weight: $fw-semibold;
        }

        p {
            margin:      0;
            font-size:   $fs-sm;
            color:       $on-felt-muted;
            line-height: $lh-normal;
        }
    }
}

</style>
