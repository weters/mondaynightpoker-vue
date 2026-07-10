<template>
  <div class="admin-pagination">
    <button
      type="button"
      class="secondary"
      :disabled="start <= 0"
      @click.prevent="$emit('prev', start - rows)"
    >
      Previous
    </button>
    <button
      type="button"
      class="secondary"
      :disabled="count < rows"
      @click.prevent="$emit('prev', start + rows)"
    >
      Next
    </button>
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
    emits: ['prev'],
}
</script>

<style lang="scss" scoped>
.admin-pagination {
    display: flex;

    & > :not(:first-child) {
        margin-left: $space-3;
    }
}
</style>