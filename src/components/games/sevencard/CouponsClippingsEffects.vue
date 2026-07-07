<template>
  <span class="coupons-clippings-effects">
    <comic-effect
      :visible="bogoVisible"
      variant="bogo"
    >BOGO!</comic-effect>
    <comic-effect
      :visible="nailClippingVisible"
      variant="nailclipping-refund"
    >Nail clipping found. Meal comp'd!</comic-effect>
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
    // seat order; the splash waits for this participant's card to land
    order: {
        type: Number,
        required: true,
    },
    dealDelay: {
        type: Number,
        default: 200,
    },
})

const store = usePokerStore()
const variantState = computed(() => store.gameState?.variantState)

const bogoKey = computed(() =>
    variantState.value?.bogoPlayerId === props.participant.playerId
        ? variantState.value.bogoPlayerId
        : null)

const nailClippingKey = computed(() => {
    const ids = variantState.value?.nailClippingPlayerIds
    if (!ids || ids.length === 0 || !ids.includes(props.participant.playerId)) {
        return null
    }

    return `${store.gameState.round}:${ids.join(',')}`
})

const cardLandingDelay = () => props.order * props.dealDelay + 250

const {visible: bogoVisible} = useSplashEffect(bogoKey, {delay: cardLandingDelay})
const {visible: nailClippingVisible} = useSplashEffect(nailClippingKey, {delay: cardLandingDelay})
</script>
