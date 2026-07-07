<template>
    <button
        :class="buttonClasses"
        :disabled="disabled"
        :style="{ minWidth: fixedWidth }"
        @click="handleClick"
    >
        <transition name="confirm-text" mode="out-in">
            <span :key="confirming ? 'confirm' : 'label'">{{ displayText }}</span>
        </transition>
    </button>
</template>

<script>
const confirmBus = new EventTarget()

export default {
    name: "ConfirmButton",
    props: {
        label: {
            type: String,
            required: true,
        },
        confirmText: {
            type: String,
            default: 'Confirm?',
        },
        danger: Boolean,
        skipConfirm: Boolean,
        disabled: Boolean,
        buttonClass: {
            type: [String, Object, Array],
            default: '',
        },
    },
    emits: ['confirmed'],
    data() {
        return {
            confirming: false,
            resetTimeout: null,
        }
    },
    computed: {
        displayText() {
            return this.confirming ? this.confirmText : this.label
        },
        fixedWidth() {
            // Use a reasonable min-width to prevent layout shift
            const maxLen = Math.max(this.label.length, this.confirmText.length)
            return `${Math.max(maxLen * 0.65 + 1.5, 5)}em`
        },
        buttonClasses() {
            return [
                'confirm-button',
                this.buttonClass,
                {
                    confirming: this.confirming,
                    danger: this.danger,
                },
            ]
        },
    },
    created() {
        this._onResetOthers = (e) => {
            if (e.detail !== this && this.confirming) {
                this.reset()
            }
        }
        confirmBus.addEventListener('reset-others', this._onResetOthers)
    },
    methods: {
        handleClick() {
            if (this.skipConfirm) {
                confirmBus.dispatchEvent(new CustomEvent('reset-others', { detail: this }))
                this.$emit('confirmed')
                return
            }

            if (this.confirming) {
                this.confirming = false
                if (this.resetTimeout) {
                    clearTimeout(this.resetTimeout)
                    this.resetTimeout = null
                }
                this.$emit('confirmed')
                return
            }

            confirmBus.dispatchEvent(new CustomEvent('reset-others', { detail: this }))
            this.confirming = true
            this.resetTimeout = setTimeout(() => {
                this.confirming = false
                this.resetTimeout = null
            }, 3000)
        },
        reset() {
            this.confirming = false
            if (this.resetTimeout) {
                clearTimeout(this.resetTimeout)
                this.resetTimeout = null
            }
        },
    },
    beforeUnmount() {
        confirmBus.removeEventListener('reset-others', this._onResetOthers)
        if (this.resetTimeout) {
            clearTimeout(this.resetTimeout)
        }
    },
}
</script>

<style lang="scss" scoped>
@use 'sass:color';
.confirm-button {
    transition: background-color $transition-fast, color $transition-fast;

    &.confirming {
        animation: confirm-pulse 1s ease-in-out infinite;
    }

    &.danger {
        background-color: $orange;
        border-color: $orange;

        &:hover {
            background-color: color.adjust($orange, $lightness: -10%);
            border-color: color.adjust($orange, $lightness: -10%);
        }
    }

    &.action-fold {
        background-color: $red;

        &:active {
            background-color: color.adjust($red, $lightness: -10%);
        }
    }

    &.action-check {
        background-color: transparent;
        color: $orange;
        border: 1px solid $orange;

        &:active {
            background-color: rgba($orange, 0.1);
        }
    }

    &.action-bet,
    &.action-raise,
    &.action-keep-all {
        background-color: $light-green;

        &:active {
            background-color: color.adjust($light-green, $lightness: -10%);
        }
    }
}

@keyframes confirm-pulse {
    0%, 100% {
        box-shadow: 0 0 0 0 rgba(white, 0.4);
        transform: scale(1);
    }
    50% {
        box-shadow: 0 0 8px 3px rgba(white, 0.6);
        transform: scale(1.05);
    }
}

.confirm-text-enter-active,
.confirm-text-leave-active {
    transition: opacity 150ms ease;
}

.confirm-text-enter-from,
.confirm-text-leave-to {
    opacity: 0;
}
</style>
