<template>
  <div class="admin-players big-content">
    <div>
      <admin-header />

      <h3>Player List</h3>

      <error-message
        v-if="error"
        :message="error"
      />

      <edit-player
        v-if="editPlayer"
        :player="editPlayer"
        @close="editPlayer=null"
      />

      <loading
        v-if="loading"
        class="pl-loading"
      />

      <form
        class="search"
        @submit.prevent=""
      >
        <fancy-input
          v-model="search"
          type="text"
          label="Player Search"
          autocomplete="off"
        />
      </form>

      <table class="standard">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Display Name</th>
            <th>Status</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="player in players"
            :key="player.id"
          >
            <td>{{ player.id }}</td>
            <td>{{ player.email }}</td>
            <td>
              <router-link :to="'/admin/players/' + player.id">
                {{ player.displayName }}
              </router-link>
            </td>
            <td>{{ player.status }}</td>
            <td>{{ new Date(player.created).toLocaleString() }}</td>
            <td>
              <button
                type="button"
                @click="editPlayer=player"
              >
                Edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import client from "../../client"
import ErrorMessage from "../ErrorMessage.vue"
import Loading from "../Loading.vue"
import EditPlayer from "@/components/admin/EditPlayer.vue"
import FancyInput from "@/components/formelements/FancyInput.vue"
import AdminHeader from "@/components/admin/AdminHeader.vue"

export default {
    name: "AdminPlayers",
    title: 'Admin/Players',
    components: {AdminHeader, FancyInput, EditPlayer, Loading, ErrorMessage},
    data() {
        return {
            loading: false,
            error: false,
            players: null,
            search: '',
            editPlayer: null,
        }
    },
    watch: {
        search() {
            this.fetchPlayers()
        },
    },
    mounted() {
        this.fetchPlayers()
    },
    methods: {
        fetchPlayers() {
            this.loading = true
            client.getPlayers(this.search)
                .then(res => this.players = res)
                .catch(err => this.error = err)
                .finally(() => this.loading = false)
        },
    },
}
</script>

<style lang="scss" scoped>
@media (max-width: $bp-phone) {
    table.standard td:nth-child(1)::before { content: 'ID' }
    table.standard td:nth-child(2)::before { content: 'Email' }
    table.standard td:nth-child(3)::before { content: 'Display Name' }
    table.standard td:nth-child(4)::before { content: 'Status' }
    table.standard td:nth-child(5)::before { content: 'Joined' }
    table.standard td:nth-child(6)::before { content: 'Actions' }
}

h3 {
    margin-top: $space-6;
}

.pl-loading {
    position:    absolute;
    margin-left: $space-3;
}

form.search {
    max-width:     360px;
    margin-bottom: $space-3;
}

table.standard {
    width: 100%;
}
</style>