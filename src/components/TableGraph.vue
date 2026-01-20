<template>
    <Bar :data="chartData" :options="chartOptions" />
</template>

<script>
import { Bar } from 'vue-chartjs'
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
} from 'chart.js'
import balance from "../mixins/balance"

ChartJS.register(Title, Tooltip, Legend, BarElement, LineElement, PointElement, CategoryScale, LinearScale)

export default {
    name: "TableGraph",
    components: { Bar },
    mixins: [balance],
    props: {
        tables: {
            type: Array,
            required: true,
        },
    },
    computed: {
        orderedTables() {
            const tables = [...this.tables]
            tables.reverse()
            return tables
        },
        labels() {
            return this.orderedTables.map(tbl => new Date(tbl.created).toLocaleDateString())
        },
        balances() {
            return this.orderedTables.map(tbl => tbl.balance / 100.0)
        },
        cumulativeBalance() {
            let sum = 0
            return this.orderedTables.map(tbl => {
                sum += tbl.balance
                return sum / 100.0
            })
        },
        chartData() {
            return {
                labels: this.labels,
                datasets: [{
                    label: 'Weekly Winnings',
                    type: 'bar',
                    data: this.balances,
                    order: 1,
                    backgroundColor: this.balances.map(value => value < 0 ? 'rgba(255, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.4)'),
                }, {
                    label: 'Overall Winnings',
                    type: 'line',
                    data: this.cumulativeBalance,
                    order: 0,
                    backgroundColor: 'transparent',
                    borderColor: this.cumulativeBalance.map(value => value < 0 ? 'red' : 'black'),
                    segment: {
                        borderColor: ctx => {
                            const value = ctx.p1.parsed.y
                            return value < 0 ? 'red' : 'black'
                        }
                    },
                }],
            }
        },
        chartOptions() {
            return {
                responsive: true,
                scales: {
                    y: {
                        ticks: {
                            callback: function (value) {
                                return '$' + value
                            },
                        },
                    },
                },
            }
        },
    },
}
</script>

<style scoped>

</style>
