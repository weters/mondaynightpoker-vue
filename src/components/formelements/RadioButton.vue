<template>
  <label :class="{ 'radio-button': true, disabled }">
    <span class="label">{{ label }}</span>
    <input
      type="radio"
      :value="value"
      :checked="value === modelValue"
      @change="$emit('update:modelValue', $event.target.checked && value)"
    >
    <span class="radio" />
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
.radio-button {
    display:     flex;
    align-items: center;
    position:    relative;
    @include tap-target;
    cursor:      pointer;

    input[type=radio] {
        // visually hidden but still focusable/tabbable (unlike display:none)
        position: absolute;
        width:    1px;
        height:   1px;
        margin:   -1px;
        opacity:  0;
        overflow: hidden;

        &:checked + span.radio {
            &::before {
                border-color: $primary;
            }

            &::after {
                background-color: $accent;
            }
        }

        &:focus-visible + span.radio {
            @include focus-ring;
        }
    }

    span.label {
        order:       2;
        margin-left: $spacing-medium;
    }

    span.radio {
        order:       1;
        display:     block;
        flex-shrink: 0;
        width:       $control-width;
        height:      $control-size;
        position:    relative;

        &::before {
            display:        block;
            width:          $control-size;
            height:         $control-size;
            content:        '';
            background-color: $surface-card;
            border-radius:  $control-size;
            position:       absolute;
            border:         1px solid $hairline;
            top:            50%;
            left:           50%;
            transform:      translate(-50%, -50%);
            transition:     border-color $dur-fast $ease-standard;
        }

        &::after {
            display:          block;
            content:          '';
            width:            $control-size - 5px;
            height:           $control-size - 5px;
            border-radius:    24px;
            position:         absolute;
            top:              50%;
            left:             50%;
            transform:        translate(-50%, -50%);
            background-color: transparent;
            transition:       background-color $dur-fast $ease-standard;
        }
    }

    &.disabled {
        cursor: not-allowed;

        span.radio {
            opacity: 0.2;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        span.radio::before,
        span.radio::after {
            transition: background-color $dur-fast linear, border-color $dur-fast linear;
        }
    }
}
</style>
