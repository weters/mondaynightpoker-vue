<template>
    <div>
        <h3>Players</h3>

        <transition name="error">
            <error :message="error" v-if="error"/>
        </transition>

        <div class="players-list">
            <template v-for="client in clients">
                <div class="player" :key="client.player.id">
                    <div class="primary">
                        <div class="connected">
                            <span class="connected" v-if="client.active && client.isConnected"></span>
                            <span class="sitting-out" v-else-if="client.isConnected"></span>
                            <span class="disconnected" v-else></span>
                        </div>

                        <span class="name" :key="`name-${client.player.id}`">{{ client.player.displayName }}</span>

                        <span class="balance" :key="`balance-${client.player.id}`">
                            <span v-if="client.isSeated">{{ formatAmount(client.balance) }}</span>
                            <span v-else class="na">N/A</span>
                        </span>
                    </div>
                    <div class="admin-options" v-if="isTableAdmin && client.isSeated">
                        <span class="active" :key="`active-${client.player.id}`">
                            <label class="optional">
                                <span>Active</span>
                                <input type="checkbox" @change="setPlayerActive($event, client)"
                                       :checked="client.active"/>
                            </label>
                        </span>
                        <span class="admin" :key="`connected-${client.player.id}`" v-if="isTableAdmin">
                            <label v-if="client.player.id !== user.player.id" class="optional">
                                <span>Table Admin</span>
                                <input type="checkbox" @change="setTableAdmin($event, client)"
                                       :checked="client.isTableAdmin"/>
                            </label>
                            <span v-else></span>
                        </span>
                    </div>
                </div>
            </template>
        </div>

        <div class="guests">
            <h4>Guests</h4>

            <ul>
                <li v-for="client in guestClients" :key="client.player.id">{{ client.player.displayName }}</li>
            </ul>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapState} from "vuex"
    import balance from "@/mixins/balance"
    import Error from "@/components/Error"
    import {mdiCoffee} from '@mdi/js'

    export default {
        name: "PokerTablePlayerList",
        mixins: [balance],
        components: {Error},
        props: {
            clientState: {
                type: Object,
                required: true,
            },
        },
        data() {
            const {clientState, user} = this.$store.state
            return {
                mdiCoffee,
                error: null,
                currentUserActive: clientState[user.player.id].active,
            }
        },
        computed: {
            ...mapState(['user', 'webSocket']),
            ...mapGetters(['isTableAdmin', 'userClientState']),
            allClients() {
                return this.clientState && Object.values(this.clientState).sort((a, b) => a.player.displayName.localeCompare(b.player.displayName))
            },
            clients() {
                return this.allClients.filter(c => c.isSeated)
            },
            guestClients() {
                return this.allClients.filter(c => !c.isSeated)
            }
        },
        methods: {
            setTableAdmin(event, client) {
                event.target.disabled = true
                this.webSocket.send('tableAdmin', null, null, {
                        isTableAdmin: event.target.checked,
                        playerId: client.playerId,
                    })
                    .catch(err => {
                        event.target.checked = !event.target.checked
                        this.showError(err)
                    })
                    .finally(() => event.target.disabled = false)
            },
            setPlayerActive(event, client) {
                const checked = event.target.checked

                const payload = {
                    active: checked,
                }

                if (client.player.id !== this.user.player.id) {
                    payload.playerId = client.player.id
                }

                event.target.disabled = true
                this.webSocket.send('playerStatus', null, null, payload)
                    .catch(err => {
                        event.target.checked = !event.target.checked
                        this.showError(err)
                    })
                    .finally(() => event.target.disabled = false)
            },
            showError(err) {
                if (this.timeout) {
                    clearTimeout(this.timeout)
                }

                this.error = err
                this.timeout = setTimeout(() => {
                    this.error = null
                }, 2000)
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import '../../variables';

    .players-list {
        margin-bottom: $spacing;
        div.connected {

            span {
                display: block;
                width: 8px;
                height: 8px;
                background-color: black;
                border-radius: 8px;
                vertical-align: middle;
                margin-right: $spacing-small;

                &.connected {
                    background-color: $primary;
                }

                &.sitting-out {
                    background-color: $red;
                }

                &.disconnected {
                    background-color: $border-color;
                }
            }
        }
        .player {
            margin-bottom: $spacing-small;

            &:not(:last-child) {
                padding-bottom: $spacing-small;
                border-bottom:  1px solid $border-color;
            }
        }

        .primary {
            display: flex;
            align-items: center;
        }

        div.status {
            font-size:      0.6em;
            text-transform: uppercase;
            margin-left: calc(8px + #{$spacing-small});

            .yes {
            }

            .no {
                color: $text-color-light;
            }

            span.sitting-out {
                font-weight: bold;
            }

            span.guest {
                color: $text-color-light;
            }
        }

        div.admin-options {
            margin-left: calc(12px + #{$spacing-small});
            display: flex;
        }

        span.balance {
            margin-left: auto;
        }
    }

    span.na {
        color: $text-color-light;
    }

    label {
        display:     flex;
        align-items: center;
        margin:      0;

        span {
            order: 2;
        }

        input {
            order:        1;
            display:      inline;
            margin-right: $spacing-small;
        }
    }

    .guests ul {
        list-style: none;
        margin: 0 0 $spacing;

        li {
            display: inline-block;

            &:not(:first-child)::before {
                content: ', ';
            }
        }
    }
</style>