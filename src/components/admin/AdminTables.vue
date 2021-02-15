<template>
    <div class="admin-tables big-content">
        <div>
            <admin-header/>

            <loading v-if="loading"/>
            <error :message="error" v-else-if="error"/>
            <div v-else-if="Array.isArray(tables) && tables.length > 0">
                <table class="standard">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Created By</th>
                        <th>Created</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="table in tables" :key="table.uuid">
                        <td>
                            <router-link :to="`/table/${encodeURIComponent(table.uuid)}`">{{ table.name }}</router-link>
                        </td>
                        <td>{{ table.playerEmail }}</td>
                        <td>{{ relativeDate(table.created) }}</td>
                    </tr>
                    </tbody>
                </table>

                <admin-pagination :start="start" :rows="rows" :count="count" @prev="fetch" @next="fetch"/>
            </div>
            <div v-else>
                <p>No tables</p>
            </div>
        </div>
    </div>
</template>

<script>
import AdminHeader from "@/components/admin/AdminHeader"
import client from "@/client"
import Loading from "@/components/Loading"
import Error from "@/components/Error"
import AdminPagination from "@/components/admin/AdminPagination"

export default {
    name: "AdminTables",
    title: 'Admin/Tables',
    components: {AdminPagination, Error, Loading, AdminHeader},
    data() {
        return {
            tables: null,
            start: 0,
            rows: 25,
            count: 0,
            loading: false,
            error: null,
        }
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
}
</script>

<style scoped>

</style>