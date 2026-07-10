<template>
  <transition name="slide-error">
    <div
      v-if="errorMessage"
      class="error"
    >
      <p>{{ errorMessage }}</p>
    </div>
  </transition>
</template>

<script>
import {mapState} from "pinia"
import {useRootStore} from "@/store"

export default {
    name: "ErrorBanner",
    computed: {
        ...mapState(useRootStore, ['error']),
        errorMessage() {
            if (!this.error) {
                return
            }

            return typeof (this.error) === 'object' && this.error.message ? this.error.message : this.error
        },
    },
}
</script>

<style lang="scss" scoped>
.error {
    position:      fixed;
    bottom:        $space-3;
    right:         0;
    z-index:       $z-toast;
    min-width:     220px;
    max-width:     min(360px, calc(100vw - #{$space-4}));
    background:    $surface-card;
    border-left:   3px solid $negative;
    border-radius: $radius-md 0 0 $radius-md;
    box-shadow:    $shadow-md;

    p {
        margin:    0;
        padding:   $space-3 $space-4;
        color:     $ink;
        font-size: $fs-sm;
        line-height: $lh-snug;

        &::before {
            content:        'ERROR';
            display:        block;
            margin-bottom:  $space-1;
            color:          $negative;
            font-weight:    $fw-bold;
            font-size:      $fs-2xs;
            letter-spacing: $tracking-caps;
        }
    }
}

.slide-error-enter-active, .slide-error-leave-active {
    transition: transform $dur-slow $ease-standard, opacity $dur-slow $ease-standard;
}

.slide-error-enter-from, .slide-error-leave-to {
    transform: translateX(100%);
    opacity:   0;
}

@media (prefers-reduced-motion: reduce) {
    .slide-error-enter-active, .slide-error-leave-active {
        transition: opacity $dur-fast linear;
    }

    .slide-error-enter-from, .slide-error-leave-to {
        transform: none;
        opacity:   0;
    }
}
</style>