<template>
    <div class="table-list main-box">
        <error :message="error" v-if="error"/>

        <h2>My Tables</h2>

        <p>These are a list of tables that you have joined.</p>

        <loading v-if="loading"/>
        <table v-if="tables" class="standard">
            <thead>
            <tr>
                <th>Name</th>
                <th>Created</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="table in tables" :key="table.uuid">
                <td><router-link :to="`/table/${table.uuid}`">{{ table.name }}</router-link></td>
                <td>{{ relativeDate(table.created) }}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import Loading from "@/components/Loading"
    import Error from "@/components/Error"
    import client from "@/client"

    export default {
        name: "TableList",
        components: {Error, Loading},
        data() {
            return {
                loading: true,
                tables: null,
                error: null,
            }
        },
        mounted() {
            client.listTables()
                .then(res => this.tables = res)
                .catch(err => this.error = err)
                .finally(() => this.loading = false)
        },
    }
</script>

<style scoped>

</style>