<template>
    <div class="table-stake">
        <h4>Table Stake</h4>
        <form @submit.prevent="save" v-if="editTableStake">
            <fancy-input
                :min="5"
                :max="100"
                :step="5"
                type="number"
                label="Table Stakes"
                unit="$"
                v-model="tableStake"
            />

            <div class="buttons">
                <button type="button" class="secondary" @click="reset">Cancel</button>
                <button type="submit" :disabled="saving">Save</button>
            </div>
        </form>
        <div v-else>
            <button @click="editTableStake=true">
                ${{ $store.getters.userClientState.tableStake / 100 }}
            </button>
        </div>
    </div>
</template>

<script>
import FancyInput from "@/components/formelements/FancyInput.vue"

export default {
    name: "TableStakes",
    components: {FancyInput},
    data() {
        return {
            editTableStake: false,
            tableStake: String(this.$store.getters.userClientState.tableStake / 100),
            saving: false,
        }
    },
    methods: {
        save() {
            this.saving = true
            this.$store.state.webSocket.send('tableStake', null, null, {
                    tableStake: parseInt(this.tableStake, 10) * 100,
                })
                .then(() => this.editTableStake = false)
                .catch(err => {
                    this.$store.dispatch('error', err)
                })
                .finally(() => this.saving = false)
        },
        reset() {
            this.tableStake = String(this.$store.getters.userClientState.tableStake / 100)
            this.editTableStake = false
        },
    },
}
</script>

<style scoped lang="scss">
@import '../variables.scss';

div.table-stake {
    @include card;
    padding: $spacing;

    h4 {
        margin: 0 0 $spacing-medium;
        font-size: 0.9rem;
        font-weight: 600;
        color: $secondary;
    }

    form {
        .buttons {
            display: flex;
            gap: $spacing-medium;
            margin-top: $spacing;

            button {
                flex: 1;
                padding: $spacing-medium;
            }
        }
    }

    & > div > button {
        width: 100%;
        padding: $spacing-medium $spacing;
        font-size: 1.5rem;
        font-weight: 600;
        background: linear-gradient(135deg, rgba($primary, 0.08), rgba($secondary, 0.08));
        border: 2px dashed $border-color;
        border-radius: $border-radius;
        color: $primary;
        cursor: pointer;
        transition: all $transition-fast;

        &:hover {
            border-style: solid;
            border-color: $primary;
            background: rgba($primary, 0.05);
        }
    }
}
</style>