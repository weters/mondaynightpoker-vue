<template>
    <div class="profile-graph">
        <line-chart :data="chartData" :options="chartOptions" />
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
            const tables = [...this.tables]
            tables.reverse()
            return tables
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
                    borderColor: ctx => {
                        if (!ctx.chart.chartArea) return 'black'
                        const { ctx: canvasCtx, chartArea: { top, bottom } } = ctx.chart
                        const gradient = canvasCtx.createLinearGradient(0, top, 0, bottom)
                        gradient.addColorStop(0, '#4CAF50')
                        gradient.addColorStop(1, '#F26E50')
                        return gradient
                    },
                    backgroundColor: ctx => {
                        if (!ctx.chart.chartArea) return 'transparent'
                        const { ctx: canvasCtx, chartArea: { top, bottom } } = ctx.chart
                        const gradient = canvasCtx.createLinearGradient(0, top, 0, bottom)
                        gradient.addColorStop(0, 'rgba(76, 175, 80, 0.15)')
                        gradient.addColorStop(1, 'rgba(242, 110, 80, 0.15)')
                        return gradient
                    },
                    segment: {
                        borderColor: ctx => {
                            const y0 = ctx.p0.parsed.y
                            const y1 = ctx.p1.parsed.y
                            const avg = (y0 + y1) / 2
                            return avg < 0 ? '#F26E50' : '#4CAF50'
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
                        ticks: {
                            callback: value => '$' + value,
                        },
                    },
                    x: {
                        ticks: {
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
