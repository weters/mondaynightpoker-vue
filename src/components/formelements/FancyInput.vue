<template>
  <label
    :class="{ 'fancy-input': true, 'with-value': inputValue || isFocused || isAutoFilled, 'required': required && !hideRequired, invalid, unit}"
  >
    <span class="label">{{ label }}</span>
    <span
      v-if="unit"
      class="unit"
    >{{ unit }}</span>
    <input
      ref="input"
      v-model="inputValue"
      :type="type"
      :pattern="pattern"
      :disabled="disabled"
      :autocomplete="autocomplete"
      :required="required"
      :min="min"
      :max="max"
      :step="step"
      @input="$emit('update:modelValue', $event.target.value)"
      @invalid="isInvalid"
      @focus="isFocused=true"
      @blur="isFocused=false"
    >
    <transition name="alert">
      <mdi-icon
        v-if="showAlert"
        :icon="mdiAlertCircle"
      />
    </transition>
  </label>
</template>

<script>
import {mdiAlertCircle} from "@mdi/js"
import MdiIcon from "@/components/MdiIcon.vue"

export default {
    name: "FancyInput",
    components: {MdiIcon},
    props: {
        label: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            default: 'text',
        },
        autocomplete: String,
        pattern: String,
        disabled: Boolean,
        showAlert: Boolean,
        required: Boolean,
        modelValue: String,
        hideRequired: Boolean,
        min: Number,
        max: Number,
        step: Number,
        unit: String,
        autofocus: Boolean,
    },
    emits: ['update:modelValue'],
    data() {
        return {
            mdiAlertCircle,
            inputValue: this.modelValue,
            isFocused: false,
            isAutoFilled: false,
            invalid: false,
        }
    },
    watch: {
        inputValue() {
            this.invalid = false
        },
        modelValue(newValue) {
            this.inputValue = newValue
        }
    },
    mounted() {
        this.$refs.input.addEventListener('animationstart', this.animationStart, { passive: true })
        if (this.autofocus) {
            this.$nextTick(() => {
                this.$refs.input.focus()
                this.$refs.input.select()
            })
        }
    },
    beforeUnmount() {
        this.$refs.input.removeEventListener('animationstart', this.animationStart)
    },
    methods: {
        // hack to determine if Google has autofilled the field
        animationStart({ animationName }) {
            if (animationName.match(/^onAutoFillStart/)) {
                this.isAutoFilled = true
            } else if (animationName.match(/^onAutoFillCancel/)) {
                this.isAutoFilled = false
            }
        },
        isInvalid() {
            this.invalid = true
        },
    },
}
</script>

<style lang="scss" scoped>
label.fancy-input {
    position: relative;

    &.unit {
        margin-left: 2em;
    }

    span.unit {
        position:           absolute;
        left:               -2em;
        top:                0;
        padding:            14px 0;
        width:              2em;
        background-color:   $surface-sunken;
        color:              $primary;
        text-align:         center;
        border:             1px solid $hairline;
        border-right-width: 0;
        border-radius:      $radius-sm 0 0 $radius-sm;
    }

    span.label {
        @include inline-label;
    }

    input {
        transition: border-color $dur-fast $ease-standard, box-shadow $dur-fast $ease-standard;

        // tidy the native Chrome/Safari yellow autofill flash to match the card surface
        &:-webkit-autofill,
        &:-webkit-autofill:focus {
            -webkit-text-fill-color: $ink;
            box-shadow:              0 0 0 1000px $surface-card inset;
        }
    }

    &:hover input:not(:focus):not(:disabled) {
        border-color: $ink-faint;
    }

    &.invalid {
        span.label {
            color: $negative;
        }

        input {
            border-color: $negative;
            position:     relative;
            z-index:      1;

            &:focus {
                box-shadow: 0 0 0 3px rgba($negative, 0.15);
            }
        }
    }

    &.required {
        span.label::after {
            content: '*';
            color:   $accent;
        }
    }

    &.with-value {
        @include inline-label-with-value;
    }

    input {
        input::after {
            content: '$';
        }

        /* hack to determine if Google has autofilled the field */
        @keyframes onAutoFillStart {  from {}  to {}}
        @keyframes onAutoFillCancel {  from {}  to {}}

        &:-webkit-autofill {
            animation-name: onAutoFillStart;
        }
        &:not(:-webkit-autofill) {
            animation-name: onAutoFillCancel;
        }
    }

    :deep(svg) {
        width:       1em;
        height:      1em;
        margin-left: $spacing-small;
        fill:        $accent;
        position:    absolute;
        top:         50%;
        right:       14px;
        transform:   translateY(-50%);
    }

    .alert-enter-active,
    .alert-leave-active {
        transition: opacity $dur-normal $ease-standard, transform $dur-normal $ease-standard;
    }

    .alert-enter-from, .alert-leave-to {
        transform: translateY(100%);
        opacity:   0;
    }

    @media (prefers-reduced-motion: reduce) {
        .alert-enter-active,
        .alert-leave-active {
            transition: opacity $dur-fast linear;
        }

        .alert-enter-from, .alert-leave-to {
            transform: none;
        }
    }
}
</style>
