<template>
    <div class="table-list">
        <error :message="error" v-if="error"/>

        <loading v-if="loading"/>

        <div class="columns" v-if="tables">
            <div class="tables-section">
                <h3 class="section-label">Your Tables</h3>
                <div class="table-card" v-if="tables.length > 0">
                    <table class="standard">
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
                            <td :class="{balance: true, negative: table.balance < 0, positive: table.balance > 0 }">{{ formatAmount(table.balance) }}</td>
                            <td class="graph">
                                <toggle v-model="graph" :value="table.uuid"/>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="empty-state" v-else>
                    <p>You haven't joined any tables yet.</p>
                    <p>Create a new table to get started playing with your friends!</p>
                </div>
            </div>

            <div class="graph-section" v-if="tables.length > 0">
                <h3 class="section-label">Performance</h3>
                <div class="graph-card">
                    <table-graph :tables="tablesToGraph"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Loading from "@/components/Loading.vue"
import Error from "@/components/Error.vue"
import client from "@/client"
import balance from "../mixins/balance"
import TableGraph from "./TableGraph.vue"
import Toggle from "@/components/formelements/Toggle.vue"

export default {
    name: "TableList",
    components: {Toggle, TableGraph, Error, Loading},
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

.section-label {
    @include section-header;
}

.table-card, .graph-card {
    @include card;
    padding: $spacing;
}

.empty-state {
    @include card;
    padding: $spacing * 1.5;
    text-align: center;
    color: $text-color-light;

    p {
        margin: 0 0 $spacing-medium 0;

        &:last-child {
            margin-bottom: 0;
        }
    }
}

table.standard {
    width: 100%;

    .balance {
        text-align: right;

        &.negative {
            color: $red;
        }

        &.positive {
            color: $light-green;
        }
    }

    .graph {
        text-align: center;
    }

    .toggle {
        justify-content: center;
    }

    @media (max-width: #{$media-small-table-width}) {
        td:nth-child(1)::before { content: 'Name' }
        td:nth-child(2)::before { content: 'Created' }
        td:nth-child(3)::before { content: 'Balance' }
        td:nth-child(4)::before { content: 'Graph' }

        .balance, .graph {
            text-align: left;
        }

        .toggle {
            justify-content: flex-start;
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
        align-items:           start;
    }
}

.tables-section, .graph-section {
    @media (max-width: 999px) {
        margin-bottom: $spacing;
    }
}
</style>