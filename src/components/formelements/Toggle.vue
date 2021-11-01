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