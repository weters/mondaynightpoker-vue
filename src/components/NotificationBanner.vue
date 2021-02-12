<template>
    <transition name="slide-notification">
        <div class="notification" v-if="notification">
            <p>{{ notification }}</p>
        </div>
    </transition>
</template>

<script>
import {mapState} from "vuex"

export default {
    name: "NotificationBanner",
    computed: {
        ...mapState(['notification']),
    },
}
</script>

<style lang="scss" scoped>
@import '../variables';

.notification {
    border-radius:    $border-radius 0 0 $border-radius;
    border-left:      3px solid $green;
    background-color: white;
    position:         fixed;
    bottom:           $spacing-medium;
    right:            0;
    box-shadow:       0 2px 4px rgba(black, 0.1);
    min-width:        150px;
    z-index:          1000;

    p {
        &::before {
            content:     'NOTIFICATION';
            color:       $green;
            font-weight: bold;
            font-size:   0.7em;
            display:     block;
        }

        margin:  0;
        padding: $spacing-medium;
    }
}

.slide-notification-enter-active, .slide-notification-leave-active {
    transition: all 300ms;
}

.slide-notification-enter, .slide-notification-leave-to {
    transform: translateX(100%);
}
</style>