<template>
    <label :class="{ toggle: true, disabled }">
        <span class="label" v-if="label">{{ label }}</span>
        <input type="checkbox" :checked="Array.isArray(modelValue) ? modelValue.includes(value) : modelValue" @change="changed"
               :disabled="disabled"/>
        <span class="checkbox"></span>
    </label>
</template>

<script>
export default {
    name: "Toggle",
    props: {
        modelValue: [Boolean, Array],
        value: String,
        label: String,
        disabled: Boolean,
    },
    emits: ['update:modelValue'],
    methods: {
        changed(event) {
            if (Array.isArray(this.modelValue)) {
                if (event.target.checked) {
                    const newValue = [...this.modelValue]
                    newValue.push(this.value)
                    this.$emit('update:modelValue', newValue)
                } else {
                    this.$emit('update:modelValue', this.modelValue.filter(f => f !== this.value))
                }
            } else {
                this.$emit('update:modelValue', event.target.checked)
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
