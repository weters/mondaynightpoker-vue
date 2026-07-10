<template>
  <div class="table-stake">
    <h4>Table Stake</h4>
    <form
      v-if="editTableStake"
      @submit.prevent="save"
    >
      <fancy-input
        v-model="tableStake"
        :min="5"
        :max="100"
        :step="5"
        type="number"
        label="Table Stakes"
        unit="$"
        autofocus
      />

      <div class="buttons">
        <button
          type="button"
          class="secondary"
          @click="reset"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="saving"
        >
          Save
        </button>
      </div>
    </form>
    <div v-else>
      <button @click="editTableStake=true">
        ${{ userClientState.tableStake / 100 }}
      </button>
    </div>
  </div>
</template>

<script>
import {mapActions, mapState} from "pinia"
import FancyInput from "@/components/formelements/FancyInput.vue"
import {useRootStore} from "@/store"

export default {
    name: "TableStakes",
    components: {FancyInput},
    data() {
        return {
            editTableStake: false,
            tableStake: String(useRootStore().userClientState.tableStake / 100),
            saving: false,
        }
    },
    computed: {
        ...mapState(useRootStore, ['userClientState']),
    },
    methods: {
        ...mapActions(useRootStore, ['webSocketSend', 'setError']),
        save() {
            this.saving = true
            this.webSocketSend({
                    action: 'tableStake',
                    additionalData: {tableStake: parseInt(this.tableStake, 10) * 100},
                })
                .then(() => this.editTableStake = false)
                .catch(err => {
                    this.setError(err)
                })
                .finally(() => this.saving = false)
        },
        reset() {
            this.tableStake = String(this.userClientState.tableStake / 100)
            this.editTableStake = false
        },
    },
}
</script>

<style scoped lang="scss">
div.table-stake {
    @include card;
    padding: $spacing;

    h4 {
        @include section-header;
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
        @include numeric;
        @include tap-target;
        width: 100%;
        padding: $spacing-medium $spacing;
        font-size: $fs-xl;
        font-weight: $fw-bold;
        background: linear-gradient(135deg, rgba($primary, 0.08), rgba($secondary, 0.08));
        border: 2px dashed $hairline;
        border-radius: $radius-md;
        color: $primary;
        cursor: pointer;
        transition: background $dur-fast $ease-standard, border-color $dur-fast $ease-standard;

        &:hover {
            border-style: solid;
            border-color: $primary;
            background: rgba($primary, 0.05);
        }

        &:focus-visible {
            @include focus-ring;
        }
    }
}
</style>