<template>
    <label :class="{ toggle: true, disabled }">
        <span class="label" v-if="label">{{ label }}</span>
        <input type="checkbox" :checked="Array.isArray(checked) ? checked.includes(value) : checked" @change="changed"
               @input="$emit('input', $event)" :disabled="disabled"/>
        <span class="checkbox"></span>
    </label>
</template>

<script>
export default {
    name: "Toggle",
    model: {
        event: 'change',
        prop: 'checked',
    },
    props: {
        checked: [Boolean, Array],
        value: String,
        label: String,
        disabled: Boolean,
    },
    methods: {
        changed(event) {
            if (Array.isArray(this.checked)) {
                if (event.target.checked) {
                    const newValue = [...this.checked]
                    newValue.push(this.value)
                    this.$emit('change', newValue)
                } else {
                    this.$emit('change', this.checked.filter(f => f !== this.value))
                }
            } else {
                this.$emit('change', event.target.checked)
            }
        },
    },
}
</script>

<style lang="scss" scoped>
@import '../variables';

.toggle {
    display:     flex;
    align-items: center;

    input[type=checkbox] {
        display: none;

        &:checked + span.checkbox {
            background-color: $peach;

            &::before {
                left: $control-width - $control-size;
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
        background-color: $gray;
        position:         relative;
        transition:       background-color 150ms;

        &::before {
            display:          block;
            content:          '';
            width:            $control-size;
            height:           $control-size;
            position:         absolute;
            top:              0;
            left:             0;
            border-radius:    9999px;
            background-color: $orange;
            transition:       left 150ms;
            box-shadow:       1px 1px 3px rgba(black, 0.4);
        }
    }

    &.disabled span.checkbox {
        opacity: 0.2;
    }
}
</style>