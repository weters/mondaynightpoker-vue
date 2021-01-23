<template>
    <div class="dev-tools">
        <h2>Dev Tools</h2>

        <table>
            <tbody>
            <tr>
                <th>ID</th>
                <td>{{ player.id }}</td>
            </tr>
            <tr>
                <th>Name</th>
                <td>{{ player.displayName }}</td>
            </tr>
            <tr>
                <th>Admin</th>
                <td>{{ player.isSiteAdmin }}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import {mapState} from "vuex"

export default {
    name: "DevTools",
    computed: {
        ...mapState(['user']),
        player() {
            if (this.user && this.user.player) {
                return this.user.player
            }

            return {}
        },
    },
}
</script>

<style lang="scss" scoped>
.dev-tools {
    border-radius:    5px;
    background-color: white;
    padding:          5px;
    position:         fixed;
    top:              75px;
    right:            5px;
    font-size:        12px;

    h2 {
        font-size: 14px;
        margin: 0;
    }

    table {
        margin: 0;
        th {
            text-align: left;
        }
    }
}
</style>