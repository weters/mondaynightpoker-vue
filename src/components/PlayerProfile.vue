<template>
  <div class="player-profile big-content">
    <div>
      <h2 v-if="profile">
        {{ profile.player.displayName }}
      </h2>
      <h2 v-else-if="loading">
        Loading...
      </h2>

      <error-message
        v-if="error"
        :message="error"
      />
      <loading v-if="loading" />

      <template v-if="profile">
        <div class="time-filter">
          <button
            v-for="preset in presets"
            :key="preset.label"
            :class="['secondary', { active: activePreset === preset.label }]"
            @click="applyPreset(preset)"
          >
            {{ preset.label }}
          </button>
          <div class="date-inputs">
            <input
              v-model="fromDate"
              type="date"
              @change="applyCustomDates"
            >
            <input
              v-model="toDate"
              type="date"
              @change="applyCustomDates"
            >
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
            <span
              class="stat-value"
              :class="{ negative: profile.stats.totalWinnings < 0 }"
            >{{ formatAmount(profile.stats.totalWinnings) }}</span>
            <span class="stat-label">Total Winnings</span>
          </div>
        </div>

        <div
          v-if="Object.keys(profile.stats.winningsByGame).length > 0"
          class="winnings-by-game"
        >
          <h3>Winnings by Game</h3>
          <table class="standard">
            <thead>
              <tr>
                <th>Game</th>
                <th class="text-right">
                  Games
                </th>
                <th class="text-right">
                  Winnings
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(amount, game) in profile.stats.winningsByGame"
                :key="game"
              >
                <td>{{ game }}</td>
                <td class="text-right">
                  {{ profile.stats.gamesCountByType[game] || 0 }}
                </td>
                <td
                  class="text-right"
                  :class="{ negative: amount < 0, positive: amount > 0 }"
                >
                  {{ formatAmount(amount) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          v-if="profile.graphData && profile.graphData.length > 0"
          class="balance-graph"
        >
          <h3>Cumulative Winnings</h3>
          <profile-graph :tables="profile.graphData" />
        </div>

        <div class="tables-section">
          <h3>Tables</h3>
          <table class="standard">
            <thead>
              <tr>
                <th>Name</th>
                <th>Balance</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="table in profile.tables"
                :key="table.uuid"
              >
                <td>
                  <router-link :to="'/table/' + table.uuid">
                    {{ table.name }}
                  </router-link>
                </td>
                <td :class="{ negative: table.balance < 0 }">
                  {{ formatAmount(table.balance) }}
                </td>
                <td>{{ new Date(table.created).toLocaleDateString() }}</td>
              </tr>
            </tbody>
          </table>

          <admin-pagination
            :start="start"
            :rows="rows"
            :count="profile.tables.length"
            @prev="changePage"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import client from "../client"
import ErrorMessage from "./ErrorMessage.vue"
import Loading from "./Loading.vue"
import ProfileGraph from "./ProfileGraph.vue"
import AdminPagination from "./admin/AdminPagination.vue"
import balance from "../mixins/balance"

export default {
    name: "PlayerProfile",
    title() {
        return this.profile ? this.profile.player.displayName : 'Player Profile'
    },
    components: { AdminPagination, ProfileGraph, Loading, ErrorMessage },
    mixins: [balance],
    props: {
        id: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            loading: false,
            error: null,
            profile: null,
            start: 0,
            rows: 10,
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
    watch: {
        id() {
            this.start = 0
            this.fetchProfile()
        },
    },
    mounted() {
        this.fetchProfile()
    },
    methods: {
        fetchProfile() {
            this.loading = true
            this.error = null
            client.getPlayerProfile(this.id, this.start, this.rows, this.from, this.to)
                .then(res => this.profile = res)
                .catch(err => this.error = err)
                .finally(() => this.loading = false)
        },
        applyPreset(preset) {
            this.activePreset = preset.label
            this.start = 0
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
            this.start = 0
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
        changePage(newStart) {
            this.start = newStart
            this.fetchProfile()
        },
    },
}
</script>

<style lang="scss" scoped>
.player-profile {
    > div {
        @include page-width;
    }

    h2 {
        margin-bottom: $spacing;
    }

    h3 {
        @include section-header;
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

        @media (max-width: #{$media-small-table-width}) {
            td:nth-child(1)::before { content: 'Game' }
            td:nth-child(2)::before { content: 'Games' }
            td:nth-child(3)::before { content: 'Winnings' }

            .text-right {
                text-align: left;
            }
        }
    }

    .balance-graph {
        margin-bottom: $spacing;
    }

    .tables-section {
        margin-bottom: $spacing;

        td a {
            color: $primary;
            text-decoration: none;

            &:hover {
                text-decoration: underline;
            }
        }

        td.negative {
            color: $error;
        }

        .admin-pagination {
            margin-top: $spacing-medium;
        }
    }
}
</style>
