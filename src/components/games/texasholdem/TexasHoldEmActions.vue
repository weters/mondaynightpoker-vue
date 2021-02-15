<template>
    <div :class="{'texas-hold-em-actions': true, 'future-action': !isCurrentAction}">
        <div class="buttons" v-if="!hideButtons">
            <button v-if="futureAction" type="button" @click="futureAction = null" class="future-action">
                <span>{{ futureAction.name }}</span>
                <span v-if="futureAction.amount">{{ formatAmount(futureAction.amount) }}</span>
            </button>
            <template v-else-if="confirm">
                <button type="button" class="secondary" @click="confirm = null">Cancel
                </button>
                <button type="button" @click="executeAction(confirm)">
                    <span>Yes, {{ confirm.action.name }}</span>
                    <span v-if="confirm.action.amount">{{ formatAmount(confirm.action.amount) }}</span>
                </button>
            </template>
            <template v-else>
                <button type="button" v-for="action in actions" :key="action.id" @click="confirm = { action, isCurrentAction }">
                    <span>{{ action.name }}</span>
                    <span v-if="action.amount">{{ formatAmount(action.amount) }}</span>
                </button>
            </template>
        </div>
    </div>
</template>

<script>
import {mapGetters, mapState} from "vuex"
import balance from "@/mixins/balance"

export default {
    name: "TexasHoldEmActions",
    mixins: [balance],
    data() {
        return {
            futureAction: null,
            confirm: null,
            hideButtons: false,
        }
    },
    computed: {
        ...mapState(['webSocket']),
        ...mapGetters({
            currentActions: 'texasHoldEm/actions',
            futureActions: 'texasHoldEm/futureActions',
        }),
        actions() {
            return this.isCurrentAction ? this.currentActions : this.futureActions
        },
        isCurrentAction() {
            return Array.isArray(this.currentActions) && this.currentActions.length > 0
        },
    },
    methods: {
        executeAction({ action, isCurrentAction }) {
            if (!isCurrentAction) {
                this.futureAction = action
                this.confirm = null
                return
            }

            this.futureAction = null
            this.confirm = null
            this.hideButtons = true
            this.webSocket.send(action.name)
                .catch(err => {
                    this.hideButtons = false
                    this.$store.dispatch('error', err)
                })
        },
    },
    watch: {
        currentActions(actions) {
            this.hideButtons = false
            this.confirm = null

            if (this.futureAction && actions) {
                for (let action of actions) {
                    if (action.name === this.futureAction.name && action.amount === this.futureAction.amount) {
                        this.executeAction({ action: this.futureAction, isCurrentAction: true })
                        return
                    }
                }

                this.futureAction = null
            }
        },
        futureActions(actions) {
            this.hideButtons = false
            if (this.futureAction && actions) {
                for (let action of actions) {
                    if (action.name === this.futureAction.name && action.amount === this.futureAction.amount) {
                        return
                    }
                }

                this.futureAction = null
            }
        }
    },
}
</script>

<style lang="scss" scoped>
@import '../../../variables';

.texas-hold-em-actions {
    button {
        span:not(:last-child) {
            margin-right: $spacing-small;
        }

        @keyframes pulse {
            from, to {
                transform: none;
            }
            50% {
                transform: scale(1.05);
            }
        }

        &.future-action {
            animation: pulse ease-in-out 2s infinite;
        }
    }

    &.future-action button {
        border: 1px solid $orange;
        background-color: transparent;
        color: $orange;

        &.secondary {
            border-color: transparent;
        }
    }
}
</style>