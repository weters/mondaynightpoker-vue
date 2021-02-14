<template>
    <div class="scheduled-game">
        <h3>Game Scheduled</h3>

        <div class="content">
            <div class="info">
                <p class="game"><strong>{{ replaceTokens(info.name) }}</strong> starts in <strong>{{ t }}</strong></p>
                <p class="ante">{{ formatAmount(info.ante) }}</p>
                <p class="started-by">{{ player }}</p>
            </div>

            <label class="optional">
                <span>Deal me in</span>
                <input type="checkbox" :checked="isPlayerActive" @change="$emit('setPlayerActive', $event)"/>
            </label>

            <div class="buttons">
                <button type="button" @click="$emit('cancel')" class="secondary" v-if="canStart">Cancel</button>
            </div>
        </div>
    </div>
</template>

<script>
    import balance from "../mixins/balance"

    export default {
        name: "ScheduledGame",
        mixins: [balance],
        props: {
            info: {
                type: Object,
                required: true,
            },
            canStart: Boolean,
            isPlayerActive: Boolean,
        },
        data() {
            return {
                t: new Date(this.info.start) - new Date(),
            }
        },
        computed: {
            player() {
                return this.$store.getters.playerDataById(this.info.playerId).player.displayName
            },
        },
        mounted() {
            const update = () => {
                const diff = new Date(this.info.start) - new Date()
                this.t = Math.round(diff / 1000)
                if (this.t < 0) {
                    this.t = 0
                } else {
                    setTimeout(update, 250)
                }
            }

            setTimeout(update, 0)
        },
    }
</script>

<style lang="scss" scoped>
    @import '../variables';

    .scheduled-game {
        background-color: white;
        border-radius:    $border-radius;
        padding:          $spacing;

        .content {
            display: flex;
            flex-wrap: wrap;
            align-items: center;

            div.info {
                order: 1;
                flex: 1 1 25%;
            }

            div.buttons {
                flex: 0 0 auto;
                margin-left: auto;
                padding-left: $spacing;
                order: 2;
            }

            label {
                order: 3;
                flex: 0 0 100%;
                width: auto;

                input {
                    width: auto;
                }
            }
        }

        p {
            margin: 0;
        }

        .game {
            strong {
            }
        }

        .ante {
            font-weight: bold;

            &::before {
                font-weight: normal;
                content:     'Ante: ';
            }
        }

        .started-by {
            font-weight: bold;

            &::before {
                font-weight: normal;
                content:     'Started by: ';
            }
        }
    }

    .buttons {
        margin: 0;
    }

    label {
        display:     flex;
        align-items: center;
        margin-top:  $spacing-medium;

        input {
            order: 1;
        }

        span {
            order:       2;
            margin-left: $spacing-small;
        }
    }
</style>