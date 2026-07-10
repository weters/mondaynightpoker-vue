<template>
  <div class="dealer-log">
    <h3>History</h3>

    <div class="container">
      <transition-group
        name="log"
        tag="div"
      >
        <div
          v-for="log in logs"
          :key="log.key"
          class="log"
        >
          <div class="time">
            {{ new Date(log.time).toLocaleTimeString() }}
          </div>
          <div class="message">
            {{ log.message }}
          </div>
          <div class="cards">
            <text-playing-card
              v-for="(card, i) in log.cards"
              :key="i"
              class="card"
              :card="card"
            />
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
    import {mapState} from "pinia"
    import TextPlayingCard from "./TextPlayingCard.vue"
    import {useRootStore} from "@/store"

    export default {
        name: "DealerLog",
        components: {TextPlayingCard},
        computed: {
            ...mapState(useRootStore, {storeLogs: 'logs'}),
            logs() {
                const logs = [...this.storeLogs]
                return logs.reverse()
            },
        },
    }
</script>

<style lang="scss" scoped>
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
        transition: background-color $dur-fast $ease-standard;
        border-bottom: 1px solid rgba($hairline, 0.6);

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
            @include numeric;
            color: $ink-muted;
            font-size: $fs-xs;
            font-weight: $fw-medium;
            margin-right: $spacing;
            white-space: nowrap;
            padding: $spacing-small $spacing-medium;
            background: $gray;
            border-radius: $radius-sm;
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
            font-size: $fs-sm;
            color: $ink;

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

    // ---- In-game (felt) context: the history reads as a dark console ----
    .in-game {
        .dealer-log h3 {
            color: $on-felt-muted;
        }

        .dealer-log .container {
            background: rgba(#000, 0.18);
            border: 1px solid $felt-hairline;
            border-radius: $radius-md;
            box-shadow: none;
            // top fade mask so the newest entries feel like they surface
            -webkit-mask-image: linear-gradient(to bottom, transparent 0, #000 18px);
            mask-image: linear-gradient(to bottom, transparent 0, #000 18px);
        }

        .log {
            border-bottom-color: $felt-hairline;

            &:nth-child(odd) {
                background-color: rgba(#fff, 0.03);
            }

            &:hover {
                background-color: rgba(#fff, 0.05);
            }

            .time {
                color: $on-felt-muted;
                background: rgba(#fff, 0.06);
            }

            .message {
                color: $on-felt-muted;
            }

            :deep(strong),
            :deep(.player-name) {
                color: $peach;
                font-weight: $fw-semibold;
            }
        }
    }

    .log-enter-active {
        transition: transform $dur-normal $ease-standard, opacity $dur-normal $ease-standard;
    }

    .log-enter-from {
        opacity: 0;
        transform: translateY(-20px);
    }

    .log-leave-active {
        transition: opacity $dur-fast $ease-standard;
    }

    .log-leave-to {
        opacity: 0;
    }

    @media (prefers-reduced-motion: reduce) {
        .log-enter-active {
            transition: opacity $dur-fast linear;
        }

        .log-enter-from {
            transform: none;
        }
    }
</style>