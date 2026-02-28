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

            <div class="profile-section" v-if="profile">
                <h3 class="section-label">Performance</h3>

                <div class="time-filter">
                    <button v-for="preset in presets" :key="preset.label"
                            :class="['secondary', { active: activePreset === preset.label }]"
                            @click="applyPreset(preset)">{{ preset.label }}</button>
                    <div class="date-inputs">
                        <input type="date" v-model="fromDate" @change="applyCustomDates"/>
                        <input type="date" v-model="toDate" @change="applyCustomDates"/>
                    </div>
                </div>

                <div class="stats-cards">
                    <div class="stat-card">
                        <span class="stat-value">{{ profile.stats.tablesJoined }}</span>
                        <span class="stat-label">Tables Joined</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-value">{{ profile.stats.gamesPlayed }}</span>
                        <span class="stat-label">Games Played</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-value" :class="{ negative: profile.stats.totalWinnings < 0 }">{{ formatAmount(profile.stats.totalWinnings) }}</span>
                        <span class="stat-label">Total Winnings</span>
                    </div>
                </div>

                <div class="winnings-by-game" v-if="Object.keys(profile.stats.winningsByGame).length > 0">
                    <h4>Winnings by Game</h4>
                    <table class="standard">
                        <thead>
                            <tr>
                                <th>Game</th>
                                <th class="text-right">Games</th>
                                <th class="text-right">Winnings</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(amount, game) in profile.stats.winningsByGame" :key="game">
                                <td>{{ game }}</td>
                                <td class="text-right">{{ profile.stats.gamesCountByType[game] || 0 }}</td>
                                <td class="text-right" :class="{ negative: amount < 0, positive: amount > 0 }">{{ formatAmount(amount) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="balance-graph" v-if="profile.tables.length > 0">
                    <h4>Cumulative Winnings</h4>
                    <profile-graph :tables="profile.tables"/>
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
import ProfileGraph from "./ProfileGraph.vue"
import Toggle from "@/components/formelements/Toggle.vue"

export default {
    name: "TableList",
    components: {Toggle, ProfileGraph, Error, Loading},
    mixins: [balance],
    data() {
        return {
            loading: true,
            tables: null,
            error: null,
            graph: [],
            profile: null,
            from: '',
            to: '',
            fromDate: '',
            toDate: '',
            activePreset: 'All',
            presets: [
                { label: '1M', months: 1 },
                { label: '3M', months: 3 },
                { label: '6M', months: 6 },
                { label: '1Y', months: 12 },
                { label: 'All', months: 0 },
            ],
        }
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

        this.fetchProfile()
    },
    methods: {
        fetchProfile() {
            client.getMyProfile(0, 100, this.from, this.to)
                .then(res => this.profile = res)
                .catch(() => {})
        },
        applyPreset(preset) {
            this.activePreset = preset.label
            if (preset.months === 0) {
                this.from = ''
                this.to = ''
                this.fromDate = ''
                this.toDate = ''
            } else {
                const now = new Date()
                const fromDate = new Date(now)
                fromDate.setMonth(fromDate.getMonth() - preset.months)
                this.from = fromDate.toISOString()
                this.to = now.toISOString()
                this.fromDate = fromDate.toISOString().split('T')[0]
                this.toDate = now.toISOString().split('T')[0]
            }
            this.fetchProfile()
        },
        applyCustomDates() {
            this.activePreset = ''
            if (this.fromDate) {
                this.from = new Date(this.fromDate + 'T00:00:00Z').toISOString()
            } else {
                this.from = ''
            }
            if (this.toDate) {
                this.to = new Date(this.toDate + 'T23:59:59Z').toISOString()
            } else {
                this.to = ''
            }
            this.fetchProfile()
        },
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

.table-card {
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
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: $spacing;
        align-items: start;
    }
}

.tables-section, .profile-section {
    @media (max-width: 999px) {
        margin-bottom: $spacing;
    }
}

.profile-section {
    h4 {
        @include section-header;
        font-size: 1em;
    }

    .time-filter {
        display: flex;
        align-items: center;
        gap: $spacing-small;
        margin-bottom: $spacing;
        flex-wrap: wrap;

        button {
            &.secondary.active {
                background-color: $primary;
                color: white;
            }
        }

        .date-inputs {
            display: flex;
            gap: $spacing-small;
            margin-left: $spacing-small;

            input {
                padding: 7px 14px;
                border: 1px solid $border-color;
                border-radius: $border-radius-small;
                font-size: 1em;
            }
        }
    }

    .stats-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: $spacing-medium;
        margin-bottom: $spacing;

        .stat-card {
            @include card;
            padding: $spacing;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;

            .stat-value {
                font-size: 1.5em;
                font-weight: 600;
                color: $primary;

                &.negative {
                    color: $error;
                }
            }

            .stat-label {
                font-size: 0.85em;
                color: $text-color-light;
                margin-top: $spacing-small;
            }
        }
    }

    .winnings-by-game {
        margin-bottom: $spacing;

        .text-right {
            text-align: right;
        }

        .negative {
            color: $red;
        }

        .positive {
            color: $light-green;
        }
    }

    .balance-graph {
        margin-bottom: $spacing;
    }
}
</style>
