<script>
    import {Line} from 'vue-chartjs'
    import balance from "../mixins/balance"

    export default {
        name: "TableGraph",
        extends: Line,
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
        },
        mounted() {
            this.drawChart()
        },
        watch: {
            tables() {
                this.drawChart()
            }
        },
        methods: {
            drawChart() {
                this.renderChart({
                        datasets: [{
                            label: 'Weekly Winnings',
                            type: 'bar',
                            data: this.balances,
                            // this dataset is drawn below
                            order: 1,
                            backgroundColor(context) {
                                const index = context.dataIndex
                                const value = context.dataset.data[index]
                                return value < 0 ? 'rgba(255, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.4)'
                            },
                        }, {
                            label: 'Overall Winnings',
                            type: 'line',
                            data: this.cumulativeBalance,
                            // this dataset is drawn on top
                            order: 2,
                            backgroundColor: 'transparent',
                            borderColor(context) {
                                const index = context.dataIndex
                                const value = context.dataset.data[index]
                                return value < 0 ? 'red' : 'black'
                            },
                            function() {
                                console.log('shit')
                            },
                        }],
                        labels: this.labels,
                    },
                    {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    // Include a dollar sign in the ticks
                                    callback: function (value) {
                                        return '$' + value
                                    },
                                },
                            }],
                        },
                    })
            },
        },
    }
</script>

<style scoped>

</style>