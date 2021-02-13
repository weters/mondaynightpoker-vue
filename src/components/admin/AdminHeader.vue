<template>
    <div class="admin-header">
        <h2>Admin</h2>

        <ul class="admin-menu">
            <li>
                <router-link to="/admin">Admin</router-link>
            </li>
            <li>
                <router-link to="/admin/players">Players</router-link>
            </li>
            <li>
                <router-link to="/admin/tables">Tables</router-link>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: "AdminHeader",
}
</script>

<style scoped>

</style>