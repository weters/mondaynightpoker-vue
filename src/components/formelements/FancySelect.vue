<template>
    <label class="fancy-label">
        <span class="label">{{ label }}</span>
        <select :value="value" @input="$emit('input', $event.target.value)">
            <option v-for="opt in options"
                    :key="opt[0]"
                    :value="opt[0]"
                    >{{ opt[1] }}</option>
        </select>
    </label>
</template>

<script>
export default {
    name: "FancySelect",
    props: {
        label: {
            type: String,
            required: true,
        },
        options: {
            type: Array,
            required: true,
        },
        value: String,
    },
}
</script>

<style lang="scss" scoped>
@import '../../variables';

label.fancy-label {
    position: relative;

    span.label {
        @include inline-label;
    }

    @include inline-label-with-value;
}
</style>