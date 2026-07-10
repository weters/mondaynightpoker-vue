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
    padding: $space-1 $space-2;
    font-size: $fs-sm;
    font-weight: $fw-bold;
    text-align: center;
    border-radius: $radius-md;
    z-index: $z-raised;
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
        border-radius: $radius-lg;
        opacity: 0.3;
    }
}

// Personality stays (comic-book splash), but every hue now comes from the
// token palette so the effects agree with the rest of the felt.
.mushroom-effect {
    background: linear-gradient(135deg, $mnp-ember-600, $mnp-ink-900);
    color: #fff;
    text-shadow: 1px 1px 2px rgba(#000, 0.5);
    box-shadow: 0 2px 8px rgba($mnp-ember-600, 0.6);
}

.antidote-effect {
    background: linear-gradient(135deg, $positive, $mnp-ink-900);
    color: #fff;
    text-shadow: 1px 1px 2px rgba(#000, 0.5);
    box-shadow: 0 2px 8px rgba($positive, 0.6);
}

.no-antidote-effect {
    background: linear-gradient(135deg, $negative, $mnp-red-600);
    color: #fff;
    text-shadow: 1px 1px 2px rgba(#000, 0.5);
    box-shadow: 0 2px 8px rgba($negative, 0.6);
}

.bogo-effect {
    background: linear-gradient(135deg, $gold-soft, $gold);
    color: $suit-black;
    text-shadow: 1px 1px 2px rgba(#fff, 0.5);
    box-shadow: 0 2px 8px rgba($gold, 0.6);
}

.nailclipping-refund-effect {
    background: linear-gradient(135deg, $positive, $mnp-ink-900);
    color: #fff;
    text-shadow: 1px 1px 2px rgba(#000, 0.5);
    box-shadow: 0 2px 8px rgba($positive, 0.6);
    max-width: 180px;
    white-space: normal;
}

.comic-pop-enter-active {
    animation: comic-pop-in $dur-slow $ease-spring;
}

.comic-pop-leave-active {
    animation: comic-pop-out $dur-normal $ease-accel;
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

// Reduced motion: keep the splash legible (it carries game info) but drop
// the scale/travel — fade only, leaving the base translateX(-50%) centering
// untouched.
@media (prefers-reduced-motion: reduce) {
    .comic-pop-enter-active {
        animation: comic-pop-fade-in $dur-fast linear;
    }

    .comic-pop-leave-active {
        animation: comic-pop-fade-out $dur-fast linear;
    }
}

@keyframes comic-pop-fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
}

@keyframes comic-pop-fade-out {
    from { opacity: 1; }
    to   { opacity: 0; }
}
</style>
