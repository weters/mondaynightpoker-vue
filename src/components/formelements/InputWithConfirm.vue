<template>
  <div class="input-with-confirm">
    <fancy-input
      v-model="primary"
      :type="type"
      :autocomplete="autocomplete"
      :disabled="disabled"
      :label="label"
      :required="true"
    />

    <fancy-input
      v-model="confirm"
      :type="type"
      :autocomplete="autocomplete"
      :disabled="disabled"
      :label="`Confirm ${label}`"
      :show-alert="mismatch"
      :required="true"
    />
  </div>
</template>

<script>
import {mdiAlertCircle} from "@mdi/js"
import FancyInput from "@/components/formelements/FancyInput.vue"

export default {
    name: "InputWithConfirm",
    components: {FancyInput},
    props: {
        label: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            default: 'text',
        },
        placeholder: {
            type: String,
            default: '',
        },
        autocomplete: {
            type: String,
            default: 'on',
        },
        disabled: Boolean,
        modelValue: {
            type: Object,
            required: true,
        }
    },
    emits: ['update:modelValue'],
    data() {
        return {
            mdiAlertCircle,
            primary: '',
            confirm: '',
            mismatch: false,
        }
    },
    watch: {
        primary(newValue) {
            this.emit()
            if (this.confirm.length === 0) {
                this.mismatch = false
                return
            }

            this.mismatch = newValue !== this.confirm
        },
        confirm(newValue) {
            this.emit()
            this.mismatch = this.primary !== newValue
        },
        modelValue(newValue) {
            this.primary = newValue.primary
            this.confirm = newValue.confirm
        }
    },
    methods: {
        emit() {
            this.$emit('update:modelValue', {
                primary: this.primary,
                confirm: this.confirm,
            })
        }
    },
}
</script>

<style lang="scss" scoped>
.input-with-confirm {
    :deep(label.fancy-input) {
        position: relative;

        input {
            border-radius: 0;
        }

        &:focus-within {
            z-index: 1;
        }

        &:first-child {
            margin-bottom: -1px;

            input {
                border-radius: $radius-sm $radius-sm 0 0;
            }
        }

        &:last-child input {
            border-radius: 0 0 $radius-sm $radius-sm;
        }
    }
}
</style>