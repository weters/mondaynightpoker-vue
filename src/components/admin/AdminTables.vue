<template>
  <div class="admin-tables big-content">
    <div>
      <admin-header />

      <loading v-if="loading" />
      <error-message
        v-else-if="error"
        :message="error"
      />
      <div v-else-if="Array.isArray(tables) && tables.length > 0">
        <table class="standard">
          <thead>
            <tr>
              <th>Name</th>
              <th>Created By</th>
              <th>Created</th>
              <th>Deleted</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="table in tables"
              :key="table.uuid"
            >
              <td>
                <router-link :to="`/table/${encodeURIComponent(table.uuid)}`">
                  {{ table.name }}
                </router-link>
              </td>
              <td>{{ table.playerEmail }}</td>
              <td>{{ relativeDate(table.created) }}</td>
              <td class="deleted">
                <toggle
                  :checked="table.deleted"
                  :disabled="updating"
                  @change="toggled(table, $event)"
                />
              </td>
            </tr>
          </tbody>
        </table>

        <admin-pagination
          :start="start"
          :rows="rows"
          :count="count"
          @prev="fetch"
          @next="fetch"
        />
      </div>
      <div
        v-else
        class="empty-state"
      >
        <mdi-icon
          class="empty-icon"
          :icon="mdiTableOff"
        />
        <h3>No tables</h3>
        <p class="note">
          No tables have been created yet.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import {mdiTableOff} from "@mdi/js"
import AdminHeader from "@/components/admin/AdminHeader.vue"
import client from "@/client"
import Loading from "@/components/Loading.vue"
import ErrorMessage from "@/components/ErrorMessage.vue"
import MdiIcon from "@/components/MdiIcon.vue"
import AdminPagination from "@/components/admin/AdminPagination.vue"
import Toggle from "@/components/formelements/Toggle.vue"

export default {
    name: "AdminTables",
    title: 'Admin/Tables',
    components: {Toggle, AdminPagination, ErrorMessage, Loading, AdminHeader, MdiIcon},
    data() {
        return {
            mdiTableOff,
            tables: null,
            start: 0,
            rows: 25,
            count: 0,
            loading: false,
            updating: false,
            error: null,
        }
    },
    watch: {
        tables(tables) {
            if (Array.isArray(tables)) {
                this.count = tables.length
            } else {
                this.count = 0
            }
        },
    },
    mounted() {
        this.fetch()
    },
    methods: {
        fetch(start = 0) {
            this.loading = true
            client.getTables(start, this.rows)
                .then(res => {
                    this.start = start
                    this.tables = res
                })
                .catch(err => this.error = err)
                .finally(() => this.loading = false)
        },
        toggled(table, value) {
            this.updating = true
            client.setTableDeleted(table.uuid, value)
                .then(() => {})
                .catch(err => {
                    this.error = err
                    this.fetch()
                })
                .finally(() => this.updating = false)
        },
    },
}
</script>

<style lang="scss" scoped>
table.standard {
    width: 100%;

    td.deleted {
        text-align: center;
    }
    label {
        display: inline-flex;
        margin: 0;
    }

    @media (max-width: $bp-phone) {
        td.deleted {
            text-align: left;
        }

        td:nth-child(1)::before { content: 'Name' }
        td:nth-child(2)::before { content: 'Created By' }
        td:nth-child(3)::before { content: 'Created' }
        td:nth-child(4)::before { content: 'Deleted' }
    }
}

.empty-state {
    @include card;
    display:        flex;
    flex-direction: column;
    align-items:    center;
    padding:        $space-8 $space-5;
    text-align:     center;

    .empty-icon {
        width:         56px;
        height:        56px;
        color:         $ink-faint;
        margin-bottom: $space-4;
    }

    h3 {
        margin:         0 0 $space-2 0;
        border-bottom:  none;
        padding-bottom: 0;
        color:          $ink;
    }

    .note {
        margin: 0;
    }
}
</style>