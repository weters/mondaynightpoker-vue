<template>
    <label
        :class="{ 'fancy-input': true, 'with-value': inputValue || isFocused || isAutoFilled, 'required': required && !hideRequired, invalid, unit}">
        <span class="label">{{ label }}</span>
        <span class="unit" v-if="unit">{{ unit }}</span>
        <input :type="type"
               :pattern="pattern"
               :disabled="disabled"
               :autocomplete="autocomplete"
               :required="required"
               :min="min"
               :max="max"
               :step="step"
               ref="input"
               v-model="inputValue"
               @input="$emit('update:modelValue', $event.target.value)"
               @invalid="isInvalid"
               @focus="isFocused=true"
               @blur="isFocused=false"
        />
        <transition name="alert">
            <mdi-icon :icon="mdiAlertCircle" v-if="showAlert"/>
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
    mounted() {
        this.$refs.input.addEventListener('animationstart', this.animationStart, { passive: true })
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
    watch: {
        inputValue() {
            this.invalid = false
        },
        modelValue(newValue) {
            this.inputValue = newValue
        }
    },
}
</script>

<style lang="scss" scoped>
@import '../../variables';

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
        background-color:   $gray;
        color:              $green;
        text-align:         center;
        border:             1px solid $border-color;
        border-right-width: 0;
    }

    span.label {
        @include inline-label;
    }

    &.invalid input {
        border-color: $red;
        position:     relative;
        z-index:      1;
    }

    &.required {
        span.label::after {
            content: '*';
            color:   $orange;
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
        fill:        $orange;
        position:    absolute;
        top:         50%;
        right:       14px;
        transform:   translateY(-50%);
    }

    .alert-enter-active {
        transition: opacity 400ms, transform 200ms;
    }

    .alert-leave-active {
        transition: opacity 200ms, transform 400ms;
    }

    .alert-enter-from, .alert-leave-to {
        transform: translateY(100%);
        opacity:   0;
    }
}
</style>
