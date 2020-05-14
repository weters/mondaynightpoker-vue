<template>
    <svg viewBox="0 0 24 24">
        <path :d="icon" />
    </svg>
</template>

<script>
    export default {
        name: "MdiIcon",
        props: {
            icon: {
                type: String,
                required: true,
            }
        }
    }
</script>

<style scoped>

</style>