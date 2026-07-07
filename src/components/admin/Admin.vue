<template>
  <div class="admin big-content">
    <div>
      <admin-header />

      <p>Welcome {{ user.player.displayName }}</p>
    </div>
  </div>
</template>

<script>
import {mapState} from "pinia"
import {useRootStore} from "@/store"

import AdminHeader from "@/components/admin/AdminHeader.vue"

export default {
    name: "Admin",
    components: {AdminHeader},
    title: 'Admin',
    computed: {
        ...mapState(useRootStore, ['user']),
    },
}
</script>

<style lang="scss" scoped></style>