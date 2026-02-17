<template>
    <div class="felt-table-container">
        <div class="felt-table-area">
            <div class="table-rail">
                <div class="table-felt">
                    <div class="table-center">
                        <slot name="center"></slot>
                    </div>
                </div>
            </div>

            <div
                v-for="seat in seats"
                :key="seat.participant.playerId"
                class="table-seat"
                :style="seat.style"
            >
                <slot name="player" :participant="seat.participant" :index="seat.originalIndex"></slot>
            </div>

            <transition name="dealer-btn">
                <div
                    v-if="dealerSeat"
                    class="felt-dealer-button"
                    :style="dealerSeat.buttonStyle"
                    :key="dealerSeat.playerId"
                >
                    <svg class="dealer-connector" :style="dealerSeat.connectorStyle">
                        <line x1="50%" y1="0" x2="50%" y2="100%" />
                    </svg>
                    <dealer-button />
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
import {mapState} from 'vuex'
import DealerButton from '@/components/games/poker/DealerButton.vue'

export default {
    name: 'FeltTable',
    components: {DealerButton},
    props: {
        participants: {
            type: Array,
            required: true,
        },
        dealerId: {
            type: Number,
            default: null,
        },
    },
    computed: {
        ...mapState(['user']),
        seatData() {
            const n = this.participants.length
            if (n === 0) return []

            let heroIndex = 0
            const userId = this.user && this.user.player && this.user.player.id
            if (userId) {
                const idx = this.participants.findIndex(p => p.playerId === userId)
                if (idx >= 0) heroIndex = idx
            }

            const cx = 50, cy = 50
            const rx = 42, ry = 38

            return Array.from({length: n}, (_, i) => {
                const playerIdx = (heroIndex + i) % n
                const angle = (Math.PI / 2) - (i * 2 * Math.PI / n)
                const x = cx + rx * Math.cos(angle)
                const y = cy + ry * Math.sin(angle)

                return {
                    participant: this.participants[playerIdx],
                    originalIndex: playerIdx,
                    x,
                    y,
                    angle,
                    style: {
                        left: `${x}%`,
                        top: `${y}%`,
                    },
                }
            })
        },
        seats() {
            return this.seatData
        },
        dealerSeat() {
            if (!this.dealerId) return null

            const seat = this.seatData.find(s => s.participant.playerId === this.dealerId)
            if (!seat) return null

            // Position the button between the seat and the table center,
            // offset inward along the line from seat to center (50%, 50%)
            const cx = 50, cy = 50
            const dx = cx - seat.x
            const dy = cy - seat.y
            const dist = Math.sqrt(dx * dx + dy * dy)

            // Place button ~50% of the way from seat toward center
            const t = 0.50
            const bx = seat.x + dx * t
            const by = seat.y + dy * t

            // Connector length (distance from button to seat in %)
            const connectorLen = dist * t
            // Angle of the connector line (from button pointing toward seat)
            const angleDeg = Math.atan2(seat.y - by, seat.x - bx) * (180 / Math.PI)

            return {
                playerId: this.dealerId,
                buttonStyle: {
                    left: `${bx}%`,
                    top: `${by}%`,
                },
                connectorStyle: {
                    height: `${connectorLen}%`,
                    transform: `translate(-50%, -100%) rotate(${angleDeg + 90}deg)`,
                    transformOrigin: '50% 100%',
                },
            }
        },
    },
}
</script>

<style lang="scss" scoped>
@import '../variables.scss';

.felt-table-container {
    max-width: 900px;
    margin: 0 auto $spacing;
}

.felt-table-area {
    position: relative;
    aspect-ratio: 5 / 3;
    margin: 50px 40px;

    @media (max-width: $mobile-max) {
        aspect-ratio: 3 / 4;
        margin: 30px 10px;
    }
}

.table-rail {
    position: absolute;
    inset: 10%;
    border-radius: 50%;
    background: linear-gradient(
        145deg,
        #4a2e1f 0%,
        #2c1a10 30%,
        #1a0f0a 60%,
        #2c1a10 85%,
        #3d2517 100%
    );
    padding: 5px;
    box-shadow:
        0 6px 30px rgba(0, 0, 0, 0.5),
        0 2px 10px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.08),
        inset 0 -1px 0 rgba(0, 0, 0, 0.3);

    @media (max-width: $mobile-max) {
        inset: 8%;
        padding: 3px;
    }
}

.table-felt {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background:
        radial-gradient(ellipse at 35% 25%, rgba(60, 160, 80, 0.4) 0%, transparent 50%),
        radial-gradient(ellipse at 70% 65%, rgba(40, 140, 65, 0.25) 0%, transparent 45%),
        linear-gradient(160deg, #267a38 0%, #1f6e30 30%, #1a6229 60%, #165724 100%);
    box-shadow:
        inset 0 2px 25px rgba(0, 0, 0, 0.35),
        inset 0 0 60px rgba(0, 0, 0, 0.1),
        inset 0 -2px 15px rgba(0, 0, 0, 0.2);
    position: relative;

    &::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
        background-size: 100px;
        pointer-events: none;
        opacity: 0.5;
    }
}

.table-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60%;
    text-align: center;
    z-index: 3;
    color: rgba(255, 255, 255, 0.95);

    @media (max-width: $mobile-max) {
        width: 75%;
    }
}

.table-seat {
    position: absolute;
    transform: translate(-50%, -50%);
    z-index: 2;
    width: 16%;
    min-width: 80px;
    max-width: 150px;

    @media (max-width: $mobile-max) {
        width: 26%;
        min-width: 65px;
        max-width: 115px;
    }
}

.felt-dealer-button {
    position: absolute;
    transform: translate(-50%, -50%);
    z-index: 3;

    .dealer-connector {
        position: absolute;
        width: 4px;
        overflow: visible;
        pointer-events: none;

        line {
            stroke: rgba(255, 255, 255, 0.25);
            stroke-width: 2;
            stroke-dasharray: 4 3;
        }
    }

    :deep(.dealer-button) {
        $size: 26px;
        width: $size;
        height: $size;
        font-size: 13px;
        background: linear-gradient(145deg, #f5f0e0, #d4c9a8);
        border: 2px solid #b8a97a;
        color: #4a3c1f;
        box-shadow:
            0 2px 6px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.6);
    }
}

.dealer-btn-enter-active {
    transition: all 300ms ease-out;
}

.dealer-btn-leave-active {
    transition: all 200ms ease-in;
}

.dealer-btn-enter-from,
.dealer-btn-leave-to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.5);
}
</style>

<style lang="scss">
/* Unscoped styles for overriding child component appearance on felt table */
.felt-table-container {
    /* Reset color on playing cards so black suits stay readable */
    .playing-card .big-card {
        color: #222;
    }

    /* Center content overrides for visibility on green felt */
    .table-center {
        .chip-stack {
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }

        .game-info .info-item {
            background: rgba(0, 0, 0, 0.25) !important;
            color: rgba(255, 255, 255, 0.9);

            .label {
                color: rgba(255, 255, 255, 0.6) !important;
            }
        }

        .showdown-result {
            background: rgba(0, 0, 0, 0.3) !important;
            border-color: rgba(255, 255, 255, 0.15) !important;
            color: rgba(255, 255, 255, 0.9);
            box-shadow: none !important;
        }

        .poker-pots {
            justify-content: center;
        }

        .bourre-pot {
            color: rgba(255, 255, 255, 0.9);
        }

        .trump-card .playing-card {
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .acey-deucey-round .metadata span.label {
            color: rgba(255, 255, 255, 0.8);
        }
    }

    /* Seat player component overrides */
    .table-seat {
        .texas-hold-em-participant,
        .guts-player,
        .bourre-player,
        .ptp-participant,
        .little-l-participant,
        .seven-card-participant,
        .acey-deucey-player {
            max-width: none;
            font-size: 0.8em;
        }

        .acey-deucey-player {
            margin: 0;
        }

        /* ChipStack on dark seats */
        .chip-stack {
            filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.4));
        }
    }
}

@media (max-width: 600px) {
    .felt-table-container .table-seat {
        .texas-hold-em-participant,
        .guts-player,
        .bourre-player,
        .ptp-participant,
        .little-l-participant,
        .seven-card-participant,
        .acey-deucey-player {
            font-size: 0.7em;
        }
    }
}
</style>
