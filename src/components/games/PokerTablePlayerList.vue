<template>
    <div class="poker-table-player-list">
        <h3>Players</h3>

        <transition name="error">
            <error :message="error" v-if="error"/>
        </transition>

        <div class="player-list">
            <poker-table-player v-for="client in clients" :player="client" :key="client.player.id" />
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
    import PokerTablePlayer from "@/components/PokerTablePlayer"

    export default {
        name: "PokerTablePlayerList",
        mixins: [balance],
        components: {PokerTablePlayer, Error},
        props: {
            clientState: {
                type: Object,
                required: true,
            },
        },
        data() {
            const {clientState, user} = this.$store.state
            return {
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
            setPlayerBlocked(event, client) {
                this.setFlag(event, client, 'isBlocked')
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

    .poker-table-player-list {
        h3 {
            @include section-header;
        }
    }

    div.player-list {
        @include card;
        padding: $spacing;
        display: flex;
        flex-direction: column;
        gap: $spacing-medium;

        .poker-table-player:last-child {
            margin-bottom: 0;
        }
    }

    .guests {
        margin-top: $spacing;

        h4 {
            @include section-header;
            font-size: 0.7rem;
        }

        ul {
            @include card;
            padding: $spacing-medium $spacing;
            margin: 0;
            list-style: none;
            display: flex;
            flex-wrap: wrap;
            gap: $spacing-small $spacing;

            li {
                color: $text-color-light;
                font-size: 0.9em;
                padding: $spacing-small $spacing-medium;
                background: $gray;
                border-radius: $border-radius-small;
            }
        }
    }
</style>