<template>
    <label :class="{ toggle: true, disabled }">
        <span class="label" v-if="label">{{ label }}</span>
        <input type="checkbox" :checked="Array.isArray(effectiveValue) ? effectiveValue.includes(value) : effectiveValue" @change="changed"
               :disabled="disabled"/>
        <span class="checkbox"></span>
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
@import '../../variables';

.toggle {
    display:     flex;
    align-items: center;

    input[type=checkbox] {
        display: none;

        &:checked + span.checkbox {
            background-color: $peach;
            border-color:     $peach;

            &::before {
                background-color: $orange;
                left:             $control-width - $control-size - 1px;
            }
        }
    }

    span.label {
        order:       2;
        margin-left: $spacing-medium;
    }

    span.checkbox {
        order:            1;
        display:          block;
        width:            $control-width;
        height:           $control-size;
        border-radius:    1000px;
        background-color: rgba(black, 0.05);
        position:         relative;
        transition:       all 150ms;
        border:           1px solid $border-color;

        &::before {
            display:          block;
            content:          '';
            width:            $control-size;
            height:           $control-size;
            position:         absolute;
            top:              -1px;
            left:             -1px;
            border-radius:    9999px;
            background-color: $border-color;
            transition:       left 150ms;
        }
    }

    &.disabled span.checkbox {
        opacity: 0.2;
    }
}
</style>
