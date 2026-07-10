<template>
  <div class="poker-pot">
    <div
      v-if="totalPots > 1"
      class="pot-details"
    >
      <strong>
        <template v-if="index===0">Main Pot</template>
        <template v-else>Side Pot {{ index }}</template>
      </strong>

      <ul v-if="allInParticipants">
        <li
          v-for="(name, i) in allInParticipants"
          :key="i"
        >
          {{ name }}
        </li>
      </ul>
    </div>
    <chip-stack
      class="llp-chip-stack"
      :amount="pot.amount"
    />
  </div>
</template>

<script>
import ChipStack from "@/components/ChipStack.vue"
import {mapState} from "pinia"
import {useRootStore} from "@/store"

export default {
    name: "PokerPot",
    components: {ChipStack},
    props: {
        pot: { // amount:int, allInParticipants:[int]
            type: Object,
            required: true,
        },
        index: {
            type: Number,
            required: true,
        },
        totalPots: {
            type: Number,
            required: true,
        },
    },
    computed: {
        ...mapState(useRootStore, ['playerDataById']),
        allInParticipants() {
            return this.pot.allInParticipants.map(id => this.playerDataById(id).player.displayName).sort()
        }
    }
}
</script>

<style lang="scss" scoped>
.poker-pot {
    display:         flex;
    flex-direction:  column;
    align-items:     center;
    gap:             $space-2;

    min-width:       120px;
    padding:         $space-3 $space-4;
    border-radius:   $radius-md;
    background:      radial-gradient(120% 100% at 50% 0%, $felt-surface 0%, $felt-base 100%);
    border:          1px solid $felt-hairline;
    box-shadow:      inset 0 0 50px rgba(#000, 0.35), $shadow-felt-sm;
    color:           $on-felt;

    div.pot-details {
        width:      100%;
        text-align: center;

        strong {
            display:        block;
            font-weight:    $fw-semibold;
            font-size:      $fs-2xs;
            text-transform: uppercase;
            letter-spacing: $tracking-caps;
            color:          $on-felt-muted;
        }

        ul {
            font-size:   $fs-2xs;
            color:       $on-felt-faint;
            margin:      $space-1 0 0;
            padding:     0;
            list-style:  none;
            line-height: $lh-snug;
        }
    }

    // The pot figure is gold, tabular, and softly lit — the table's heartbeat.
    .llp-chip-stack {
        margin-top: auto;

        :deep(.amount) {
            @include numeric;
            font-size:   $fs-xl;
            color:       $gold-soft;
            text-shadow: 0 0 12px rgba($gold, 0.4);
        }
    }
}
</style>