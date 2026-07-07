<template>
  <transition name="comic-pop">
    <div
      v-if="visible"
      :class="['comic-effect', `${variant}-effect`]"
    >
      <slot />
    </div>
  </transition>
</template>

<script setup>
defineProps({
    visible: Boolean,
    // one of: mushroom, antidote, no-antidote, bogo, nailclipping-refund
    variant: {
        type: String,
        required: true,
    },
})
</script>

<style lang="scss" scoped>
// Comic-book style splash; positioned against the nearest positioned ancestor
// (the participant card)
.comic-effect {
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    max-width: 120px;
    padding: 6px 10px;
    font-size: 0.8em;
    font-weight: bold;
    text-align: center;
    border-radius: 8px;
    z-index: 100;
    pointer-events: none;
    white-space: nowrap;

    &::before {
        content: '';
        position: absolute;
        top: -4px;
        left: -4px;
        right: -4px;
        bottom: -4px;
        background: inherit;
        z-index: -1;
        border-radius: 12px;
        opacity: 0.3;
    }
}

.mushroom-effect {
    background: linear-gradient(135deg, #8B4513, #551a1a);
    color: white;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    box-shadow: 0 2px 8px rgba(139, 69, 19, 0.6);
}

.antidote-effect {
    background: linear-gradient(135deg, #4CAF50, #1B5E20);
    color: white;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    box-shadow: 0 2px 8px rgba(76, 175, 80, 0.6);
}

.no-antidote-effect {
    background: linear-gradient(135deg, #f44336, #b71c1c);
    color: white;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    box-shadow: 0 2px 8px rgba(244, 67, 54, 0.6);
}

.bogo-effect {
    background: linear-gradient(135deg, #FFD700, #FFA500);
    color: #000;
    text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.5);
    box-shadow: 0 2px 8px rgba(255, 215, 0, 0.6);
}

.nailclipping-refund-effect {
    background: linear-gradient(135deg, #4CAF50, #1B5E20);
    color: white;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    box-shadow: 0 2px 8px rgba(76, 175, 80, 0.6);
    max-width: 180px;
    white-space: normal;
}

.comic-pop-enter-active {
    animation: comic-pop-in 0.3s ease-out;
}

.comic-pop-leave-active {
    animation: comic-pop-out 0.2s ease-in;
}

@keyframes comic-pop-in {
    0% {
        opacity: 0;
        transform: translateX(-50%) scale(0.3);
    }
    50% {
        transform: translateX(-50%) scale(1.1);
    }
    100% {
        opacity: 1;
        transform: translateX(-50%) scale(1);
    }
}

@keyframes comic-pop-out {
    0% {
        opacity: 1;
        transform: translateX(-50%) scale(1);
    }
    100% {
        opacity: 0;
        transform: translateX(-50%) scale(0.5);
    }
}
</style>
