<template>
    <div class="dealer-log">
        <h3>History</h3>

        <transition name="expand">
            <div class="container">
                <transition-group name="log" tag="div">
                    <div v-for="log in logs" :key="log.uuid" class="log">
                        <div class="time">{{ new Date(log.time).toLocaleTimeString() }}</div>
                        <div class="message">{{ log.message }}</div>
                        <div class="cards">
                            <text-playing-card class="card" :card="card" v-for="(card, i) in log.cards" :key="i" />
                        </div>
                    </div>
                </transition-group>
            </div>
        </transition>
    </div>
</template>

<script>
    import TextPlayingCard from "./TextPlayingCard"

    export default {
        name: "DealerLog",
        components: {TextPlayingCard},
        computed: {
            logs() {
                const logs = [...this.$store.state.logs]
                return logs.reverse()
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import '../variables';
    .dealer-log {
        .handle {
            svg {
                width:  30px;
                height: 30px;
            }
        }
    }

    .log {
        &:nth-child(odd) {
            background-color: #f3f3f3;
        }

        display: flex;
        align-items: center;
        transition: all 1s;

        .time {
            color: $text-color-light;
            font-size: 0.8em;
            margin-right: $spacing-medium;
            white-space: nowrap;
        }

        @media(max-width: 500px) {
            flex-wrap: wrap;

            .time {
                flex: 0 0 100%;
            }
        }

        .message {
            flex: 1 1 auto;
            @media (max-width: 500px) {
                flex: 1 1 50%;
            }
        }

        .cards {
            flex: 0 0 auto;
            margin-left: $spacing-medium;
        }
    }

    .log-enter {
        opacity:   0;
        transform: translateY(-100%);
    }

    .log-leave-to {
        opacity: 0;
    }
</style>