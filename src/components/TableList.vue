<template>
    <div class="table-list main-box">
        <error :message="error" v-if="error"/>

        <loading v-if="loading"/>

        <div class="columns">
            <table v-if="tables" class="standard">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Created</th>
                    <th>Balance</th>
                    <th>Graph</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="table in tables" :key="table.uuid">
                    <td>
                        <router-link :to="`/table/${table.uuid}`">{{ table.name }}</router-link>
                    </td>
                    <td>{{ relativeDate(table.created) }}</td>
                    <td :class="{balance: true, negative: table.balance < 0 }">{{ formatAmount(table.balance) }}</td>
                    <td class="graph"><label><span>Include graph?</span> <input type="checkbox" v-model="graph"
                                                                                :value="table.uuid"/></label></td>
                </tr>
                </tbody>
            </table>

            <table-graph :tables="tablesToGraph" v-if="tables"/>
        </div>
    </div>
</template>

<script>
    import Loading from "@/components/Loading"
    import Error from "@/components/Error"
    import client from "@/client"
    import balance from "../mixins/balance"
    import TableGraph from "./TableGraph"

    export default {
        name: "TableList",
        components: {TableGraph, Error, Loading},
        mixins: [balance],
        data() {
            return {
                loading: true,
                tables: null,
                error: null,
                graph: [],
            }
        },
        computed: {
            tablesToGraph() {
                const includeGraph = {}
                this.graph.forEach(g => includeGraph[g] = true)
                return this.tables.filter(g => includeGraph[g.uuid])
            },
        },
        mounted() {
            const excludeTables = JSON.parse(localStorage.getItem('exclude-tables')) || {}

            client.listTables()
                .then(res => {
                    this.tables = res
                    this.tables.forEach(tbl => !excludeTables[tbl.uuid] ? this.graph.push(tbl.uuid) : null)
                })
                .catch(err => this.error = err)
                .finally(() => this.loading = false)
        },
        watch: {
            graph() {
                const allTables = {}
                this.tables.forEach(tbl => allTables[tbl.uuid] = true)
                this.graph.forEach(g => delete (allTables[g]))
                localStorage.setItem('exclude-tables', JSON.stringify(allTables))
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import '../variables';

    table.standard {
        .balance {
            text-align: right;

            &.negative {
                color: $red;
            }
        }

        .graph {
            text-align: center;
        }

        @media (max-width: #{$media-small-table-width}) {
            td:nth-child(1)::before { content: 'Name' }
            td:nth-child(2)::before { content: 'Created' }
            td:nth-child(3)::before { content: 'Balance' }
            td:nth-child(4)::before { content: 'Show in graph' }

            .balance, .graph {
                text-align: left;
            }
        }
    }

    table label {
        margin:  0;
        padding: 0;
        width:   auto;

        span {
            display: none;
        }

        input {
            width:   auto;
            display: inline;
            margin:  0;
            padding: 0;
        }
    }

    .columns {
        @media (min-width: 1000px) {
            display:               grid;
            grid-template-columns: 1fr 1fr;
            grid-gap:              $spacing;
        }
    }
</style>