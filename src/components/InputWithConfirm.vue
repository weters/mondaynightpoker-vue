<template>
    <div class="input-with-confirm">
        <label>
            <span>{{ label }}</span>
            <input :type="type"
                   :autocomplete="autocomplete"
                   :placeholder="placeholder"
                   :disabled="disabled"
                   required
                   v-model="primary"
            />
        </label>

        <label>
            <span class="container">
                <span>Confirm {{ label }}</span>
                <transition name="alert"><mdi-icon :icon="mdiAlertCircle" v-if="mismatch"/></transition>
            </span>
            <input :type="type"
                   :autocomplete="autocomplete"
                   :placeholder="placeholder"
                   :disabled="disabled"
                   required
                   v-model="confirm"
            />
        </label>
    </div>
</template>

<script>
import {mdiAlertCircle} from "@mdi/js"
import MdiIcon from "@/components/MdiIcon"

export default {
    name: "InputWithConfirm",
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
        placeholder: {
            type: String,
            default: '',
        },
        autocomplete: {
            type: String,
            default: 'on',
        },
        disabled: Boolean,
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
@import '../variables';

label {
    & > span > span {
        vertical-align: middle;
    }

    ::v-deep svg {
        vertical-align: middle;
        width:          1em;
        height:         1em;
        margin-left:    $spacing-small;
        fill:           $alert;
    }
}

.alert-enter-active {
    transition: opacity 400ms, transform 200ms;
}

.alert-leave-active {
    transition: opacity 200ms, transform 400ms;
}

.alert-enter, .alert-leave-to {
    transform: translateY(100%);
    opacity:   0;
}
</style>