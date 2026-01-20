<template>
    <label :class="{ 'radio-button': true, disabled }">
        <span class="label">{{ label }}</span>
        <input type="radio" :value="value" :checked="value === modelValue" @change="$emit('update:modelValue', $event.target.checked && value)" />
        <span class="radio"></span>
    </label>
</template>

<script>
export default {
    name: "RadioButton",
    props: {
        modelValue: String,
        value: String,
        label: String,
        disabled: Boolean,
    },
    emits: ['update:modelValue'],
}
</script>

<style lang="scss" scoped>
@import '../../variables';
.radio-button {
    display: flex;
    align-items: center;

    input[type=radio] {
        display: none;

        &:checked + span.radio {
            &::after {
                background-color: $orange;
            }
        }
    }

    span.label {
        order: 2;
        margin-left: $spacing-medium;
    }

    span.radio {
        order: 1;
        display: block;
        width: $control-width;
        height: $control-size;
        position: relative;
        transition: background-color 150ms;

        &::before {
            display: block;
            width: $control-size;
            height: $control-size;
            content: '';
            background-color: $gray;
            border-radius: $control-size;
            position: absolute;
            border: 1px solid $border-color;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        &::after {
            display: block;
            content: '';
            width: $control-size - 5px;
            height: $control-size - 5px;
            border-radius: 24px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: $gray;
            transition: left 150ms;
        }
    }

    &.disabled span.radio {
        opacity: 0.2;
    }
}
</style>
