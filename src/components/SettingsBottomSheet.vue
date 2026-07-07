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
    background: rgba(0, 0, 0, 0.6);
    z-index: 200;
    display: flex;
    align-items: flex-end;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
}

.bottom-sheet-panel {
    background: #333;
    color: rgba(white, 0.9);
    width: 100%;
    max-height: 70vh;
    border-radius: 16px 16px 0 0;
    overflow-y: auto;
    padding-bottom: env(safe-area-inset-bottom);
    transition: transform 200ms ease;
    position: relative;
    box-shadow: 0 -8px 40px rgba(0, 0, 0, 0.4);

    // Subtle top-edge highlight
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
            rgba($peach, 0.3) 20%,
            rgba($peach, 0.5) 50%,
            rgba($peach, 0.3) 80%,
            transparent
        );
        border-radius: 16px 16px 0 0;
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
    border-radius: 16px 16px 0 0;
    z-index: 1;

    .handle-bar {
        width: 36px;
        height: 4px;
        border-radius: 2px;
        background: rgba(white, 0.2);
        transition: background $transition-fast;
    }

    &:active .handle-bar {
        background: rgba($peach, 0.5);
    }

    .bottom-sheet-close {
        position: absolute;
        right: $spacing-medium;
        background: rgba(white, 0.08);
        border: none;
        color: rgba(white, 0.5);
        cursor: pointer;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: color $transition-fast, background $transition-fast;

        svg {
            flex-shrink: 0;
        }

        &:hover {
            color: rgba(white, 0.9);
            background: rgba(white, 0.15);
        }
    }
}

.bottom-sheet-content {
    padding: 0 $spacing $spacing;

    h3 {
        font-size: 0.7em;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: rgba($peach, 0.6);
        border-bottom: 1px solid rgba(white, 0.08);
        padding-bottom: $spacing-small;
        margin: $spacing 0 $spacing-medium;
    }

    p {
        margin: $spacing-medium 0;
        font-size: 0.9em;
        color: rgba(white, 0.8);
    }

    div.buttons {
        margin: $spacing-small 0 0;
    }

    // Style toggles for dark background
    :deep(.toggle) {
        span.label {
            color: rgba(white, 0.85);
        }

        span.checkbox {
            background-color: rgba(white, 0.08);
            border-color: rgba(white, 0.15);
        }

        input[type=checkbox]:checked + span.checkbox {
            background-color: rgba($peach, 0.3);
            border-color: $peach;
        }
    }

    // Style confirm buttons for dark background
    :deep(.confirm-button) {
        background-color: rgba(white, 0.08);
        border: 1px solid rgba(white, 0.12);
        color: rgba(white, 0.85);

        &:hover {
            background-color: rgba(white, 0.14);
        }

        &.danger:not(.confirming) {
            background-color: rgba($orange, 0.15);
            border-color: rgba($orange, 0.3);
            color: $orange;

            &:hover {
                background-color: rgba($orange, 0.25);
            }
        }
    }
}

// Transitions
.bottom-sheet-enter-active,
.bottom-sheet-leave-active {
    transition: opacity 250ms ease;

    .bottom-sheet-panel {
        transition: transform 350ms cubic-bezier(0.22, 1, 0.36, 1);
    }
}

.bottom-sheet-leave-active .bottom-sheet-panel {
    transition: transform 200ms ease;
}

.bottom-sheet-enter-from,
.bottom-sheet-leave-to {
    opacity: 0;

    .bottom-sheet-panel {
        transform: translateY(100%);
    }
}
</style>
