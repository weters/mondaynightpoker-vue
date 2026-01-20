<template>
    <label class="ante">
        <span class="ante">Ante</span>
        <span class="ante-input">
            <input type="number" :min="min" :max="max" :step="step" :value="modelValue" @input="$emit('update:modelValue', parseInt($event.target.value, 10))"/>
            <em>¢</em>
        </span>
    </label>
</template>

<script>
export default {
    name: "GameSelectorAnte",
    props: {
        min: {
            type: Number,
            required: true,
        },
        max: {
            type: Number,
            required: true,
        },
        step: {
            type: Number,
            default: 25,
        },
        modelValue: {
            type: Number,
            required: true,
        },
    },
    emits: ['update:modelValue'],
}
</script>

<style lang="scss" scoped>
label.ante {
    span.ante-input {
        display: flex;
        align-items: center;

        input[type="number"] {
            flex:  1 0 100px;
            width: auto;
        }
    }

    & > span:last-child::after {
        content: '';
    }
}
</style>
