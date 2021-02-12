<template>
    <div class="admin big-content">
        <div>
            <h2>Admin</h2>

            <div class="tools">
                <player-list/>
            </div>
        </div>
    </div>
</template>

<script>
import PlayerList from "./admin/PlayerList"

export default {
    name: "Admin",
    title: 'Admin',
    components: {PlayerList},
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