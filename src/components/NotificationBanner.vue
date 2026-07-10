<template>
  <transition name="slide-notification">
    <div
      v-if="notification"
      class="notification"
    >
      <p>{{ notification }}</p>
    </div>
  </transition>
</template>

<script>
import {mapState} from "pinia"
import {useRootStore} from "@/store"

export default {
    name: "NotificationBanner",
    computed: {
        ...mapState(useRootStore, ['notification']),
    },
}
</script>

<style lang="scss" scoped>
.notification {
    position:      fixed;
    // sits above the error toast's footprint when both are visible at once
    bottom:        calc(#{$space-3} + 68px);
    right:         0;
    z-index:       $z-toast;
    min-width:     220px;
    max-width:     min(360px, calc(100vw - #{$space-4}));
    background:    $surface-card;
    border-left:   3px solid $positive;
    border-radius: $radius-md 0 0 $radius-md;
    box-shadow:    $shadow-md;

    p {
        margin:      0;
        padding:     $space-3 $space-4;
        color:       $ink;
        font-size:   $fs-sm;
        line-height: $lh-snug;

        &::before {
            content:        'NOTIFICATION';
            display:        block;
            margin-bottom:  $space-1;
            color:          $positive;
            font-weight:    $fw-bold;
            font-size:      $fs-2xs;
            letter-spacing: $tracking-caps;
        }
    }
}

.slide-notification-enter-active, .slide-notification-leave-active {
    transition: transform $dur-slow $ease-standard, opacity $dur-slow $ease-standard;
}

.slide-notification-enter-from, .slide-notification-leave-to {
    transform: translateX(100%);
    opacity:   0;
}

@media (prefers-reduced-motion: reduce) {
    .slide-notification-enter-active, .slide-notification-leave-active {
        transition: opacity $dur-fast linear;
    }

    .slide-notification-enter-from, .slide-notification-leave-to {
        transform: none;
        opacity:   0;
    }
}
</style>