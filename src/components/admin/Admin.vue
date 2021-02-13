<template>
    <div class="admin big-content">
        <div>
            <admin-header/>

            <p>Welcome {{ $store.state.user.player.displayName }}</p>
        </div>
    </div>
</template>

<script>

import AdminHeader from "@/components/admin/AdminHeader"

export default {
    name: "Admin",
    components: {AdminHeader},
    title: 'Admin',
}
</script>

<style lang="scss" scoped></style>