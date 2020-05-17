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

                        <span class="name" :key="`name-${client.player.id}`">
                            <span>{{ client.player.displayName }}</span>
                            <mdi-icon :icon="mdiAlertCircle" v-if="client.active && !client.isConnected" class="alert" />
                        </span>

                        <span class="balance" :key="`balance-${client.player.id}`">
                            {{ formatAmount(client.balance) }}
                        </span>
                    </div>
                    <div class="admin-options" v-if="isTableAdmin && client.isSeated">
                        <span class="active">
                            <label class="optional">
                                <span>Active</span>
                                <input type="checkbox" @change="setPlayerActive($event, client)"
                                       :checked="client.active"/>
                            </label>
                        </span>
                        <span class="admin">
                            <label v-if="client.player.id !== user.player.id" class="optional">
                                <span>Admin</span>
                                <input type="checkbox" @change="setTableAdmin($event, client)"
                                       :checked="client.isTableAdmin"/>
                            </label>
                            <span v-else></span>
                        </span>
                        <span class="start">
                            <label v-if="client.player.id !== user.player.id" class="optional">
                                <span>Start</span>
                                <input type="checkbox" @change="setCanStart($event, client)"
                                       :checked="client.canStart"/>
                            </label>
                            <span v-else></span>
                        </span>
                        <span class="restart">
                            <label v-if="client.player.id !== user.player.id" class="optional">
                                <span>Restart</span>
                                <input type="checkbox" @change="setCanRestart($event, client)"
                                       :checked="client.canRestart"/>
                            </label>
                            <span v-else></span>
                        </span>
                        <span class="terminate">
                            <label v-if="client.player.id !== user.player.id" class="optional">
                                <span>Terminate</span>
                                <input type="checkbox" @change="setCanTerminate($event, client)"
                                       :checked="client.canTerminate"/>
                            </label>
                            <span v-else></span>
                        </span>
                    </div>
                </div>
            </template>
        </div>

        <div class="guests" v-if="guestClients.length > 0">
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
    import {mdiAlertCircle} from '@mdi/js'
    import MdiIcon from "../MdiIcon"

    export default {
        name: "PokerTablePlayerList",
        mixins: [balance],
        components: {MdiIcon, Error},
        props: {
            clientState: {
                type: Object,
                required: true,
            },
        },
        data() {
            const {clientState, user} = this.$store.state
            return {
                mdiAlertCircle,
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
            },
        },
        methods: {
            setFlag(event, client, key) {
                const data = {
                    playerId: client.playerId,
                }
                data[key] = event.target.checked
                event.target.disabled = true
                this.webSocket.send('tableAdmin', null, null, data)
                    .catch(err => {
                        event.target.checked = !event.target.checked
                        this.showError(err)
                    })
                    .finally(() => event.target.disabled = false)
            },
            setTableAdmin(event, client) {
                this.setFlag(event, client, 'isTableAdmin')
            },
            setCanStart(event, client) {
                this.setFlag(event, client, 'canStart')
            },
            setCanRestart(event, client) {
                this.setFlag(event, client, 'canRestart')
            },
            setCanTerminate(event, client) {
                this.setFlag(event, client, 'canTerminate')
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
                display:          block;
                width:            8px;
                height:           8px;
                background-color: black;
                border-radius:    8px;
                vertical-align:   middle;
                margin-right:     $spacing-small;

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

            span.name {
                svg {
                    fill: $alert;
                    margin-left: $spacing-small;
                    width: 16px;
                    vertical-align: middle;
                }
            }
        }

        .primary {
            display:     flex;
            align-items: center;
        }

        div.status {
            font-size:      0.6em;
            text-transform: uppercase;
            margin-left:    calc(8px + #{$spacing-small});

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

            @media(min-width: 500px) {
                display: flex;

                & > * {
                    flex: 1 0 auto;
                }
            }

            label {
                width: auto;
            }
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
        margin:     0 0 $spacing;

        li {
            display: inline-block;

            &:not(:first-child)::before {
                content: ', ';
            }
        }
    }
</style>