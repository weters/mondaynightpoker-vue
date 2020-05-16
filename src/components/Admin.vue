<template>
    <div class="admin main-box">
        <h2>Admin</h2>

        <div class="tools">
            <create-table/>
            <player-list/>
        </div>
    </div>
</template>

<script>
    import CreateTable from "@/components/admin/CreateTable"
    import PlayerList from "./admin/PlayerList"

    export default {
        name: "Admin",
        components: {PlayerList, CreateTable},
    }
</script>

<style lang="scss" scoped>
    @import '../variables.scss';
    div.tools {
        & > *:not(:last-child) {
            margin-bottom: $spacing;
        }
    }
</style>