<template>
  <teleport to="body">
    <transition name="bottom-sheet">
      <div
        v-if="open"
        class="bottom-sheet-backdrop"
        @click.self="$emit('close')"
      >
        <div
          ref="panel"
          class="bottom-sheet-panel"
        >
          <div
            class="drag-handle"
            @touchstart="onDragStart"
            @touchmove="onDragMove"
            @touchend="onDragEnd"
          >
            <div class="handle-bar" />
            <button
              class="bottom-sheet-close"
              @click="$emit('close')"
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
              ><path
                :d="mdiClose"
                fill="currentColor"
              /></svg>
            </button>
          </div>
          <div class="bottom-sheet-content">
            <slot />
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
import {mdiClose} from '@mdi/js'

export default {
    name: "SettingsBottomSheet",
    props: {
        open: Boolean,
    },
    emits: ['close'],
    data() {
        return {
            mdiClose,
            dragStartY: 0,
            dragCurrentY: 0,
            dragging: false,
        }
    },
    methods: {
        onDragStart(e) {
            this.dragStartY = e.touches[0].clientY
            this.dragging = true
        },
        onDragMove(e) {
            if (!this.dragging) return
            this.dragCurrentY = e.touches[0].clientY
            const diff = this.dragCurrentY - this.dragStartY
            if (diff > 0 && this.$refs.panel) {
                this.$refs.panel.style.transform = `translateY(${diff}px)`
            }
        },
        onDragEnd() {
            if (!this.dragging) return
            this.dragging = false
            const diff = this.dragCurrentY - this.dragStartY
            if (this.$refs.panel) {
                this.$refs.panel.style.transform = ''
            }
            if (diff > 80) {
                this.$emit('close')
            }
        },
    },
}
</script>

<style lang="scss">
@use 'sass:color';
.bottom-sheet-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(#000, 0.6);
    z-index: $z-overlay;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
}

.bottom-sheet-panel {
    background: $felt-rail;
    color: $on-felt;
    width: 100%;
    max-height: 70vh;
    border-radius: $radius-lg $radius-lg 0 0;
    overflow-y: auto;
    padding-bottom: env(safe-area-inset-bottom);
    transition: transform $dur-normal $ease-spring;
    position: relative;
    box-shadow: $shadow-felt-lg;

    // desktop: anchor bottom-center, constrained width
    @media (min-width: $bp-phone) {
        max-width: 480px;
        margin: 0 auto;
    }

    // Subtle top-edge highlight (brass/ember charm)
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(
            90deg,
            transparent,
            rgba($gold, 0.35) 20%,
            rgba($peach, 0.55) 50%,
            rgba($gold, 0.35) 80%,
            transparent
        );
        border-radius: $radius-lg $radius-lg 0 0;
    }
}

.drag-handle {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 44px;
    cursor: grab;
    position: sticky;
    top: 0;
    background: $felt-rail;
    border-radius: $radius-lg $radius-lg 0 0;
    z-index: 1;

    .handle-bar {
        width: 40px;
        height: 4px;
        border-radius: $radius-pill;
        background: $on-felt-faint;
        transition: background $dur-fast $ease-standard;
    }

    &:active .handle-bar {
        background: rgba($peach, 0.6);
    }

    .bottom-sheet-close {
        position: absolute;
        right: $spacing-medium;
        @include tap-target;
        background: rgba(#fff, 0.08);
        border: none;
        color: $on-felt-muted;
        cursor: pointer;
        width: 36px;
        height: 36px;
        border-radius: $radius-pill;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: color $dur-fast $ease-standard, background $dur-fast $ease-standard;

        svg {
            flex-shrink: 0;
        }

        &:hover {
            color: $on-felt;
            background: rgba(#fff, 0.16);
        }

        &:focus-visible {
            @include focus-ring-on-felt;
        }
    }
}

.bottom-sheet-content {
    padding: 0 $spacing $spacing;

    h3 {
        font-size: $fs-xs;
        font-weight: $fw-bold;
        text-transform: uppercase;
        letter-spacing: $tracking-caps;
        color: $gold-soft;
        border-bottom: 1px solid $felt-hairline;
        padding-bottom: $spacing-small;
        margin: $spacing 0 $spacing-medium;
    }

    h4 {
        color: $on-felt;
    }

    p {
        margin: $spacing-medium 0;
        font-size: $fs-sm;
        color: $on-felt-muted;
    }

    div.buttons {
        margin: $spacing-small 0 0;
    }

    // Style toggles for dark felt background
    // (this style block is intentionally unscoped, so plain descendant
    // selectors reach the child components — :deep() only works in scoped CSS)
    .toggle {
        span.label {
            color: $on-felt;
        }

        span.checkbox {
            background-color: rgba(#fff, 0.08);
            border-color: $felt-hairline;
        }

        input[type=checkbox]:checked + span.checkbox {
            background-color: rgba($peach, 0.35);
            border-color: $peach;
        }

        input[type=checkbox]:focus-visible + span.checkbox {
            @include focus-ring-on-felt;
        }
    }

    // Style confirm buttons for dark felt background
    .confirm-button {
        background-color: rgba(#fff, 0.08);
        border: 1px solid $felt-hairline;
        color: $on-felt;

        &:hover {
            background-color: rgba(#fff, 0.14);
        }

        &:focus-visible {
            @include focus-ring-on-felt;
        }

        &.danger:not(.confirming) {
            background-color: rgba($accent, 0.16);
            border-color: rgba($accent, 0.35);
            color: $accent-hover;

            &:hover {
                background-color: rgba($accent, 0.26);
            }
        }
    }
}

// Transitions
.bottom-sheet-enter-active {
    transition: opacity $dur-slow $ease-standard;

    .bottom-sheet-panel {
        transition: transform $dur-slow $ease-spring;
    }
}

.bottom-sheet-leave-active {
    transition: opacity $dur-normal $ease-standard;

    .bottom-sheet-panel {
        transition: transform $dur-normal $ease-accel;
    }
}

.bottom-sheet-enter-from,
.bottom-sheet-leave-to {
    opacity: 0;

    .bottom-sheet-panel {
        transform: translateY(100%);
    }
}

@media (prefers-reduced-motion: reduce) {
    .bottom-sheet-panel {
        transition: none;
    }

    .bottom-sheet-enter-active,
    .bottom-sheet-leave-active {
        transition: opacity $dur-fast linear;

        .bottom-sheet-panel {
            transition: none;
        }
    }

    .bottom-sheet-enter-from,
    .bottom-sheet-leave-to {
        .bottom-sheet-panel {
            transform: none;
        }
    }
}
</style>
