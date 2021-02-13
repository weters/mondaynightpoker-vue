<template>
    <div class="admin-pagination">
        <button type="button" @click.prevent="$emit('prev', start - rows)" :disabled="start <= 0">Previous</button>
        <button type="button" @click.prevent="$emit('prev', start + rows)" :disabled="count < rows">Next</button>
    </div>
</template>

<script>
export default {
    name: "AdminPagination",
    props: {
        rows: {
            type: Number,
            default: 10,
        },
        start: {
            type: Number,
            default: 0,
        },
        count: {
            type: Number,
            required: true,
        },
    },
}
</script>

<style lang="scss" scoped>
@import '../../variables';

.admin-pagination {
    display: flex;

    & > :not(:first-child) {
        margin-left: $spacing-medium;
    }
}
</style>