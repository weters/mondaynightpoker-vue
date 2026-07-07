<template>
  <span class="chiggs-effects">
    <comic-effect
      :visible="mushroomVisible"
      variant="mushroom"
    >Mushroom Card!</comic-effect>
    <comic-effect
      :visible="antidoteVisible"
      variant="antidote"
    >Antidote!</comic-effect>
    <comic-effect
      :visible="noAntidoteVisible"
      variant="no-antidote"
    >Ah! Mushroom!</comic-effect>
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { usePokerStore } from '@/store/poker'
import { useSplashEffect } from '@/composables/useSplashEffect'
import ComicEffect from './ComicEffect.vue'

const props = defineProps({
    participant: {
        type: Object,
        required: true,
    },
})

const store = usePokerStore()
const variantState = computed(() => store.gameState?.variantState)

// each key is non-null only while the event applies to this participant; the key
// value dedupes replays
const mushroomKey = computed(() =>
    variantState.value?.mushroomHolderId === props.participant.playerId
        ? variantState.value.mushroomHolderId
        : null)

const antidoteKey = computed(() =>
    variantState.value?.antidotePlayed?.playerId === props.participant.playerId
        ? props.participant.playerId
        : null)

const noAntidoteKey = computed(() => {
    const folds = variantState.value?.mushroomFolds
    if (!folds || folds.length === 0 || !folds.some(f => f.playerId === props.participant.playerId)) {
        return null
    }

    return folds.map(f => f.playerId).sort().join(',')
})

const {visible: mushroomVisible} = useSplashEffect(mushroomKey)
const {visible: antidoteVisible} = useSplashEffect(antidoteKey)
const {visible: noAntidoteVisible} = useSplashEffect(noAntidoteKey)
</script>
