<template>
    <div class="dealer-log">
        <h3>History</h3>

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
    </div>
</template>

<script>
    import TextPlayingCard from "./TextPlayingCard.vue"

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
        h3 {
            @include section-header;
        }

        .container {
            @include card;
            overflow: hidden;
        }

        .handle {
            svg {
                width:  30px;
                height: 30px;
            }
        }
    }

    .log {
        display: flex;
        align-items: center;
        padding: $spacing-medium $spacing;
        transition: background-color $transition-fast;
        border-bottom: 1px solid rgba($border-color, 0.5);

        &:last-child {
            border-bottom: none;
        }

        &:nth-child(odd) {
            background-color: rgba($gray, 0.5);
        }

        &:hover {
            background-color: rgba($primary, 0.03);
        }

        .time {
            color: $text-color-light;
            font-size: 0.75em;
            font-weight: 500;
            margin-right: $spacing;
            white-space: nowrap;
            padding: $spacing-small $spacing-medium;
            background: $gray;
            border-radius: $border-radius-small;
        }

        @media(max-width: 500px) {
            flex-wrap: wrap;
            padding: $spacing-medium;

            .time {
                flex: 0 0 auto;
                margin-bottom: $spacing-small;
            }
        }

        .message {
            flex: 1 1 auto;
            font-size: 0.9em;
            color: $text-color;

            @media (max-width: 500px) {
                flex: 1 1 100%;
                order: 3;
            }
        }

        .cards {
            flex: 0 0 auto;
            margin-left: $spacing-medium;
            display: flex;
            gap: $spacing-small;
        }
    }

    .log-enter-active {
        transition: all $transition-normal;
    }

    .log-enter-from {
        opacity: 0;
        transform: translateY(-20px);
    }

    .log-leave-active {
        transition: opacity $transition-fast;
    }

    .log-leave-to {
        opacity: 0;
    }
</style>