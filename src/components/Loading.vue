<template>
  <transition
    name="loading"
    appear
  >
    <div
      class="loading"
      role="status"
      aria-label="Loading"
    >
      <span class="loading-ring" />
    </div>
  </transition>
</template>

<script>
    export default {
        name: "Loading",
    }
</script>

<style lang="scss" scoped>
    div.loading {
        display:     inline-flex;
        align-items: center;
        justify-content: center;
        width:  24px;
        height: 24px;
        // felt contexts can override with a scoped `.loading { color: $gold-soft; }`
        color: $accent;
    }

    .loading-ring {
        box-sizing:    border-box;
        width:         100%;
        height:        100%;
        border-radius: 50%;
        border:        3px solid transparent;
        border-top-color:   currentColor;
        border-right-color: currentColor;
        animation: mnp-spin 700ms linear infinite;
    }

    @keyframes mnp-spin {
        to { transform: rotate(360deg); }
    }

    .loading-enter-active {
        transition: opacity $dur-normal $ease-standard;
    }

    .loading-enter-from {
        opacity: 0;
    }

    @media (prefers-reduced-motion: reduce) {
        .loading-ring {
            animation: none;
            border-top-color:   currentColor;
            border-right-color: currentColor;
            border-bottom-color: currentColor;
            border-left-color:  currentColor;
            opacity: 0.6;
        }

        .loading-enter-active {
            transition: opacity $dur-fast linear;
        }
    }
</style>
