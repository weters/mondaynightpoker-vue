<template>
  <div class="table-graph">
    <Bar
      :data="chartData"
      :options="chartOptions"
    />
  </div>
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
    LineController,
    PointElement,
    CategoryScale,
    LinearScale,
} from 'chart.js'
import balance from "../mixins/balance"

ChartJS.register(Title, Tooltip, Legend, BarElement, LineElement, LineController, PointElement, CategoryScale, LinearScale)

// mirrors $positive / $negative / $hairline / $ink-muted / $suit-black in variables.scss —
// chart.js renders to <canvas>, so it can't consume SCSS tokens directly.
const CHART_POSITIVE = '#3F9E5A'
const CHART_NEGATIVE = '#E53935'
const CHART_INK = '#1C1E1D'
const CHART_GRID = '#E3DFD7'
const CHART_LABEL = '#8C867C'

// hex -> rgba() with alpha, so the bar fills can reuse the same tokens as the line
function withAlpha(hex, alpha) {
    const n = parseInt(hex.slice(1), 16)
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`
}

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
                    backgroundColor: this.balances.map(value => value < 0 ? withAlpha(CHART_NEGATIVE, 0.4) : withAlpha(CHART_POSITIVE, 0.4)),
                }, {
                    label: 'Overall Winnings',
                    type: 'line',
                    data: this.cumulativeBalance,
                    order: 0,
                    backgroundColor: 'transparent',
                    borderColor: this.cumulativeBalance.map(value => value < 0 ? CHART_NEGATIVE : CHART_INK),
                    segment: {
                        borderColor: ctx => {
                            const value = ctx.p1.parsed.y
                            return value < 0 ? CHART_NEGATIVE : CHART_INK
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
                        grid: { color: CHART_GRID },
                        ticks: {
                            color: CHART_LABEL,
                            callback: function (value) {
                                return '$' + value
                            },
                        },
                    },
                    x: {
                        grid: { color: CHART_GRID },
                        ticks: { color: CHART_LABEL },
                    },
                },
            }
        },
    },
}
</script>

<style scoped>
.table-graph {
    min-width: 0;
}
</style>
