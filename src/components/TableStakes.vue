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
                :value="tableStake.toString()"
                @input="tableStake=parseInt($event, 10)"
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
import FancyInput from "@/components/formelements/FancyInput"

export default {
    name: "TableStakes",
    components: {FancyInput},
    data() {
        return {
            editTableStake: false,
            tableStake: this.$store.getters.userClientState.tableStake / 100,
            saving: false,
        }
    },
    methods: {
        save() {
            this.saving = true
            this.$store.state.webSocket.send('tableStake', null, null, {
                    tableStake: this.tableStake * 100,
                })
                .then(() => this.editTableStake = false)
                .catch(err => {
                    this.$store.dispatch('error', err)
                })
                .finally(() => this.saving = false)
        },
        reset() {
            this.tableStake = this.$store.getters.userClientState.tableStake / 100
            this.editTableStake = false
        },
    },
}
</script>

<style scoped lang="scss">
@import '../variables.scss';

div.table-stake {
    h4 {
        margin-bottom: $spacing-medium;
    }
}
</style>