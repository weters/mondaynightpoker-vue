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
import {mapState} from "pinia"
import {useRootStore} from "@/store"

export default {
    name: "DevTools",
    computed: {
        ...mapState(useRootStore, ['user']),
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
    position:      fixed;
    top:           84px;
    right:         $space-2;
    z-index:       $z-devtools;
    background:    $mnp-gold-300;
    color:         $mnp-ink-900;
    border-radius: $radius-sm;
    box-shadow:    $shadow-md;
    padding:       $space-2 $space-3;
    font-size:     $fs-xs;

    h2 {
        margin:         0 0 $space-1;
        font-size:      $fs-xs;
        font-weight:    $fw-bold;
        text-transform: uppercase;
        letter-spacing: $tracking-wide;
        color:          $mnp-ink-900;
    }

    table {
        margin: 0;
        border-collapse: collapse;

        th {
            text-align:    left;
            padding-right: $space-2;
            font-weight:   $fw-semibold;
        }
    }
}
</style>