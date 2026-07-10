<template>
  <div class="profile-graph">
    <line-chart
      :data="chartData"
      :options="chartOptions"
    />
  </div>
</template>

<script>
import { Line } from 'vue-chartjs'
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Filler,
} from 'chart.js'
import balance from "../mixins/balance"

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler)

// mirrors $positive / $negative / $hairline / $ink-muted in variables.scss —
// chart.js renders to <canvas>, so it can't consume SCSS tokens directly.
const CHART_POSITIVE = '#3F9E5A'
const CHART_NEGATIVE = '#E53935'
const CHART_GRID = '#E3DFD7'
const CHART_LABEL = '#8C867C'

export default {
    name: "ProfileGraph",
    components: { LineChart: Line },
    mixins: [balance],
    props: {
        tables: {
            type: Array,
            required: true,
        },
    },
    computed: {
        orderedTables() {
            return this.tables
        },
        labels() {
            return this.orderedTables.map(tbl => new Date(tbl.created).toLocaleDateString())
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
                    label: 'Cumulative Winnings',
                    data: this.cumulativeBalance,
                    fill: true,
                    tension: 0.3,
                    pointRadius: this.cumulativeBalance.length > 30 ? 0 : 3,
                    pointHoverRadius: 5,
                    borderWidth: 2,
                    // colors mirror $positive / $negative in variables.scss (chart.js can't
                    // consume SCSS tokens directly, so the hex is duplicated here on purpose)
                    borderColor: ctx => {
                        if (!ctx.chart.chartArea) return CHART_POSITIVE
                        const { ctx: canvasCtx, chartArea: { top, bottom } } = ctx.chart
                        const gradient = canvasCtx.createLinearGradient(0, top, 0, bottom)
                        gradient.addColorStop(0, CHART_POSITIVE)
                        gradient.addColorStop(1, CHART_NEGATIVE)
                        return gradient
                    },
                    backgroundColor: ctx => {
                        if (!ctx.chart.chartArea) return 'transparent'
                        const { ctx: canvasCtx, chartArea: { top, bottom } } = ctx.chart
                        const gradient = canvasCtx.createLinearGradient(0, top, 0, bottom)
                        gradient.addColorStop(0, 'rgba(63, 158, 90, 0.15)')
                        gradient.addColorStop(1, 'rgba(229, 57, 53, 0.15)')
                        return gradient
                    },
                    segment: {
                        borderColor: ctx => {
                            const y0 = ctx.p0.parsed.y
                            const y1 = ctx.p1.parsed.y
                            const avg = (y0 + y1) / 2
                            return avg < 0 ? CHART_NEGATIVE : CHART_POSITIVE
                        },
                    },
                }],
            }
        },
        chartOptions() {
            return {
                responsive: true,
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        callbacks: {
                            label: ctx => '$' + ctx.parsed.y.toFixed(2),
                        },
                    },
                },
                scales: {
                    y: {
                        grid: { color: CHART_GRID },
                        ticks: {
                            color: CHART_LABEL,
                            callback: value => '$' + value,
                        },
                    },
                    x: {
                        grid: { color: CHART_GRID },
                        ticks: {
                            color: CHART_LABEL,
                            maxTicksLimit: 12,
                        },
                    },
                },
            }
        },
    },
}
</script>

<style scoped>
.profile-graph {
    min-width: 0;
}
</style>
