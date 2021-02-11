<template>
    <label :class="{ 'radio-button': true, disabled }">
        <span class="label">{{ label }}</span>
        <input type="radio" :value="value" :checked="value === checked" @change="$emit('change', $event.target.checked && value)" />
        <span class="radio"></span>
    </label>
</template>

<script>
export default {
    name: "RadioButton",
    model: {
        event: 'change',
        prop: 'checked',
    },
    props: {
        checked: String,
        value: String,
        label: String,
        disabled: Boolean,
    },
}
</script>

<style lang="scss" scoped>
@import '../variables';
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
        width: 30px;
        height: 16px;
        position: relative;
        transition: background-color 150ms;

        &::before {
            display: block;
            width: 16px;
            height: 16px;
            content: '';
            background-color: $gray;
            border-radius: 9999px;
            position: absolute;
            border: 1px solid $border-color;
            top: 50%;
            left: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        &::after {
            display: block;
            content: '';
            width: 12px;
            height: 12px;
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