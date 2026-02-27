<template>
    <teleport to="body">
        <transition name="bottom-sheet">
            <div class="bottom-sheet-backdrop" v-if="open" @click.self="$emit('close')">
                <div class="bottom-sheet-panel" ref="panel">
                    <div class="drag-handle" @touchstart="onDragStart" @touchmove="onDragMove" @touchend="onDragEnd">
                        <div class="handle-bar"></div>
                    </div>
                    <div class="bottom-sheet-content">
                        <slot></slot>
                    </div>
                </div>
            </div>
        </transition>
    </teleport>
</template>

<script>
export default {
    name: "SettingsBottomSheet",
    props: {
        open: Boolean,
    },
    emits: ['close'],
    data() {
        return {
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
@import '../variables';

.bottom-sheet-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 200;
    display: flex;
    align-items: flex-end;
}

.bottom-sheet-panel {
    background: white;
    width: 100%;
    max-height: 60vh;
    border-radius: $border-radius-large $border-radius-large 0 0;
    overflow-y: auto;
    padding-bottom: env(safe-area-inset-bottom);
    transition: transform 200ms ease;
}

.drag-handle {
    display: flex;
    justify-content: center;
    padding: $spacing-medium 0 $spacing-small;
    cursor: grab;
    position: sticky;
    top: 0;
    background: white;
    border-radius: $border-radius-large $border-radius-large 0 0;

    .handle-bar {
        width: 36px;
        height: 4px;
        border-radius: 2px;
        background: #ccc;
    }
}

.bottom-sheet-content {
    padding: 0 $spacing $spacing;

    h3 {
        font-size: 0.85em;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: $text-color-light;
        border-bottom: 1px solid $border-color;
        padding-bottom: $spacing-small;
        margin: $spacing-medium 0 $spacing-small;
    }

    p {
        margin: $spacing-small 0;
        font-size: 0.9em;
    }

    div.buttons {
        margin: $spacing-small 0 0;
    }
}

// Transitions — must be unscoped to target transition root elements
.bottom-sheet-enter-active,
.bottom-sheet-leave-active {
    transition: opacity 200ms ease;

    .bottom-sheet-panel {
        transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1);
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
