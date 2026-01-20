<template>
    <div class="input-with-confirm">
        <fancy-input :type="type"
                     :autocomplete="autocomplete"
                     :disabled="disabled"
                     :label="label"
                     v-model="primary"
                     :required="true"
                     />

        <fancy-input :type="type"
                     :autocomplete="autocomplete"
                     :disabled="disabled"
                     :label="`Confirm ${label}`"
                     :show-alert="mismatch"
                     v-model="confirm"
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
        value: {
            type: Object,
            required: true,
        }
    },
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
        value(newValue) {
            this.primary = newValue.primary
            this.confirm = newValue.confirm
        }
    },
    methods: {
        emit() {
            this.$emit('input', {
                primary: this.primary,
                confirm: this.confirm,
            })
        }
    },
}
</script>

<style lang="scss" scoped>
@import '../../variables';

label {
    &:first-child {
        margin-bottom: -1px;
    }
}
</style>