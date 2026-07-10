<template>
  <div class="table-list">
    <error-message
      v-if="error"
      :message="error"
    />

    <loading v-if="loading" />

    <div
      v-if="tables"
      class="columns"
    >
      <div class="tables-section">
        <h3 class="section-label">
          Your Tables
        </h3>
        <div
          v-if="tables.length > 0"
          class="table-card"
        >
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
              <tr
                v-for="table in tables"
                :key="table.uuid"
              >
                <td>
                  <router-link :to="`/table/${table.uuid}`">
                    {{ table.name }}
                  </router-link>
                </td>
                <td>{{ relativeDate(table.created) }}</td>
                <td :class="{balance: true, negative: table.balance < 0, positive: table.balance > 0 }">
                  <span class="amount">{{ formatAmount(table.balance) }}</span>
                </td>
                <td class="graph">
                  <toggle
                    v-model="graph"
                    :value="table.uuid"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <admin-pagination
          v-if="tables.length > 0"
          :start="start"
          :rows="rows"
          :count="tables.length"
          @prev="changePage"
        />
        <div
          v-else
          class="empty-state"
        >
          <mdi-icon
            class="empty-icon"
            :icon="mdiCardsPlayingOutline"
          />
          <h3>No tables yet</h3>
          <p class="note">
            Create a new table to get started playing with your friends!
          </p>
          <router-link
            to="/table/create"
            class="button"
          >
            Create a Table
          </router-link>
        </div>
      </div>

      <div
        v-if="profile"
        class="profile-section"
      >
        <h3 class="section-label">
          Performance
        </h3>

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
            <span class="stat-value amount">{{ profile.stats.tablesJoined }}</span>
            <span class="stat-label">Tables Joined</span>
          </div>
          <div class="stat-card">
            <span class="stat-value amount">{{ profile.stats.gamesPlayed }}</span>
            <span class="stat-label">Games Played</span>
          </div>
          <div class="stat-card">
            <span
              class="stat-value amount"
              :class="{ negative: profile.stats.totalWinnings < 0 }"
            >{{ formatAmount(profile.stats.totalWinnings) }}</span>
            <span class="stat-label">Total Winnings</span>
          </div>
        </div>

        <div
          v-if="Object.keys(profile.stats.winningsByGame).length > 0"
          class="winnings-by-game"
        >
          <h4>Winnings by Game</h4>
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
                  <span class="amount">{{ formatAmount(amount) }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          v-if="profile.graphData && profile.graphData.length > 0"
          class="balance-graph"
        >
          <h4>Cumulative Winnings</h4>
          <profile-graph :tables="profile.graphData" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mdiCardsPlayingOutline} from "@mdi/js"
import Loading from "@/components/Loading.vue"
import ErrorMessage from "@/components/ErrorMessage.vue"
import MdiIcon from "@/components/MdiIcon.vue"
import client from "@/client"
import balance from "../mixins/balance"
import ProfileGraph from "./ProfileGraph.vue"
import Toggle from "@/components/formelements/Toggle.vue"
import AdminPagination from "@/components/admin/AdminPagination.vue"

export default {
    name: "TableList",
    components: {AdminPagination, Toggle, ProfileGraph, ErrorMessage, Loading, MdiIcon},
    mixins: [balance],
    data() {
        return {
            mdiCardsPlayingOutline,
            loading: true,
            tables: null,
            error: null,
            graph: [],
            start: 0,
            rows: 10,
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
    watch: {
        graph() {
            const allTables = {}
            this.tables.forEach(tbl => allTables[tbl.uuid] = true)
            this.graph.forEach(g => delete (allTables[g]))
            localStorage.setItem('exclude-tables', JSON.stringify(allTables))
        },
    },
    mounted() {
        const excludeTables = JSON.parse(localStorage.getItem('exclude-tables')) || {}

        this.fetchTables(excludeTables)

        this.fetchProfile()
    },
    methods: {
        fetchTables(excludeTables) {
            client.listTables(this.start, this.rows)
                .then(res => {
                    this.tables = res
                    if (excludeTables) {
                        this.tables.forEach(tbl => !excludeTables[tbl.uuid] ? this.graph.push(tbl.uuid) : null)
                    }
                })
                .catch(err => this.error = err)
                .finally(() => this.loading = false)
        },
        changePage(newStart) {
            this.start = newStart
            this.fetchTables()
        },
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
}
</script>

<style lang="scss" scoped>
.section-label {
    @include section-header;
}

.table-card {
    @include card;
    padding: $space-5;

    @media (max-width: $bp-phone) {
        td:nth-child(1)::before { content: 'Name' }
        td:nth-child(2)::before { content: 'Created' }
        td:nth-child(3)::before { content: 'Balance' }
        td:nth-child(4)::before { content: 'Graph' }
    }
}

.admin-pagination {
    margin-top: $space-5;
}

.empty-state {
    @include card;
    display:        flex;
    flex-direction: column;
    align-items:    center;
    padding:        $space-8 $space-5;
    text-align:     center;

    .empty-icon {
        width:         56px;
        height:        56px;
        color:         $ink-faint;
        margin-bottom: $space-4;
    }

    h3 {
        margin:        0 0 $space-2 0;
        border-bottom: none;
        padding-bottom: 0;
        color:         $ink;
    }

    .note {
        margin: 0 0 $space-5 0;
        max-width: 40ch;
    }
}

table.standard {
    width: 100%;

    .balance {
        text-align: right;

        .amount { @include numeric; }

        &.negative { color: $negative; }
        &.positive { color: $positive; }
    }

    .graph {
        text-align: center;
    }

    .toggle {
        justify-content: center;
    }

    @media (max-width: $bp-phone) {
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
    @media (min-width: $bp-desktop) {
        display:      grid;
        grid-template-columns: 1fr 1fr;
        grid-gap:     $space-5;
        align-items:  start;
    }
}

.tables-section, .profile-section {
    @media (max-width: #{$bp-desktop - 1px}) {
        margin-bottom: $space-5;
    }
}

.profile-section {
    h4 {
        @include section-header;
        font-size: $fs-base;
    }

    .time-filter {
        display:       flex;
        align-items:   center;
        gap:           $space-2;
        margin-bottom: $space-5;
        flex-wrap:     wrap;

        button {
            &.secondary.active {
                background-color: $primary;
                border-color:      $primary;
                color:            #fff;
            }
        }

        .date-inputs {
            display:      flex;
            gap:          $space-2;
            margin-left:  $space-2;

            input {
                padding:       10px 14px;
                border:        1px solid $hairline;
                border-radius: $radius-sm;
                background:    $surface-card;
                color:         $ink;
                font-size:     $fs-base;
                font-family:   $font-text;

                &:focus-visible {
                    @include focus-ring;
                }

                &:focus {
                    border-color: $primary;
                    box-shadow:   0 0 0 3px rgba($primary, 0.15);
                }
            }
        }

        @media (max-width: $bp-phone) {
            .date-inputs {
                margin-left: 0;
                width:       100%;

                input { flex: 1 1 0; min-width: 0; }
            }
        }
    }

    .stats-cards {
        display:               grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap:                   $space-3;
        margin-bottom:         $space-5;

        .stat-card {
            @include card;
            padding:        $space-5;
            display:        flex;
            flex-direction: column;
            align-items:    center;
            text-align:     center;

            .stat-value {
                @include numeric;
                font-size:   $fs-lg;
                font-weight: $fw-semibold;
                color:       $primary;

                &.negative {
                    color: $negative;
                }
            }

            .stat-label {
                font-size:     $fs-xs;
                color:         $ink-muted;
                margin-top:    $space-1;
                text-transform: uppercase;
                letter-spacing: $tracking-wide;
            }
        }
    }

    .winnings-by-game {
        margin-bottom: $space-5;

        .text-right {
            text-align: right;

            .amount { @include numeric; }
        }

        .negative { color: $negative; }
        .positive { color: $positive; }

        @media (max-width: $bp-phone) {
            td:nth-child(1)::before { content: 'Game' }
            td:nth-child(2)::before { content: 'Games' }
            td:nth-child(3)::before { content: 'Winnings' }

            .text-right {
                text-align: left;
            }
        }
    }

    .balance-graph {
        margin-bottom: $space-5;
    }
}
</style>
