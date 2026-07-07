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
    border-radius:    $border-radius 0 0 $border-radius;
    border-left:      3px solid $error;
    background-color: white;
    position:         fixed;
    bottom:           $spacing-medium;
    right:            0;
    box-shadow:       0 2px 4px rgba(black, 0.1);
    min-width:        150px;
    z-index:          1000;

    p {
        &::before {
            content:     'ERROR';
            font-weight: bold;
            font-size:   0.7em;
            display:     block;
            color:       $error;
        }

        margin:  0;
        padding: $spacing-medium;
    }
}

.slide-error-enter-active, .slide-error-leave-active {
    transition: all 300ms;
}

.slide-error-enter-from, .slide-error-leave-to {
    transform: translateX(100%);
}
</style>