<template>
  <label :class="{ toggle: true, disabled }">
    <span
      v-if="label"
      class="label"
    >{{ label }}</span>
    <input
      type="checkbox"
      :checked="Array.isArray(effectiveValue) ? effectiveValue.includes(value) : effectiveValue"
      :disabled="disabled"
      @change="changed"
    >
    <span class="checkbox" />
  </label>
</template>

<script>
export default {
    name: "Toggle",
    props: {
        modelValue: [Boolean, Array],
        checked: Boolean, // Alias for modelValue when not using v-model
        value: String,
        label: String,
        disabled: Boolean,
    },
    emits: ['update:modelValue', 'change'],
    computed: {
        effectiveValue() {
            // Use modelValue if provided, otherwise fall back to checked prop
            return this.modelValue !== undefined ? this.modelValue : this.checked
        },
    },
    methods: {
        changed(event) {
            const newChecked = event.target.checked
            if (Array.isArray(this.effectiveValue)) {
                if (newChecked) {
                    const newValue = [...this.effectiveValue]
                    newValue.push(this.value)
                    this.$emit('update:modelValue', newValue)
                    this.$emit('change', newValue)
                } else {
                    const newValue = this.effectiveValue.filter(f => f !== this.value)
                    this.$emit('update:modelValue', newValue)
                    this.$emit('change', newValue)
                }
            } else {
                this.$emit('update:modelValue', newChecked)
                this.$emit('change', newChecked)
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.toggle {
    display:     flex;
    align-items: center;
    position:    relative;
    @include tap-target;
    cursor:      pointer;

    input[type=checkbox] {
        // visually hidden but still focusable/tabbable (unlike display:none)
        position: absolute;
        width:    1px;
        height:   1px;
        margin:   -1px;
        opacity:  0;
        overflow: hidden;

        &:checked + span.checkbox {
            background-color: $peach;
            border-color:     $peach;

            &::before {
                background-color: $accent;
                left:             $control-width - $control-size + 2px;
            }
        }

        &:focus-visible + span.checkbox {
            @include focus-ring;
        }
    }

    span.label {
        order:       2;
        margin-left: $spacing-medium;
    }

    span.checkbox {
        order:            1;
        display:          block;
        flex-shrink:      0;
        width:            $control-width;
        height:           $control-size;
        border-radius:    $radius-pill;
        background-color: $surface-sunken;
        position:         relative;
        transition:       background-color $dur-fast $ease-standard, border-color $dur-fast $ease-standard;
        border:           1px solid $hairline;

        &::before {
            display:          block;
            content:          '';
            width:            $control-size - 6px;
            height:           $control-size - 6px;
            position:         absolute;
            top:              2px;
            left:             2px;
            border-radius:    $radius-pill;
            background-color: $surface-card;
            box-shadow:       $shadow-sm;
            transition:       left $dur-fast $ease-standard, background-color $dur-fast $ease-standard;
        }
    }

    &.disabled {
        cursor: not-allowed;

        span.checkbox {
            opacity: 0.2;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        span.checkbox {
            transition: background-color $dur-fast linear, border-color $dur-fast linear;

            &::before {
                transition: background-color $dur-fast linear;
            }
        }
    }
}
</style>
