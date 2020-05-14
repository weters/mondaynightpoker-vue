<template>
    <div class="admin">
        <h2>Admin</h2>

        <create-table/>
    </div>
</template>

<script>
    import CreateTable from "@/components/admin/CreateTable"

    export default {
        name: "Admin",
        components: {CreateTable},
    }
</script>

<style scoped>

</style>