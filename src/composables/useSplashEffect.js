import { onBeforeUnmount, ref, watch } from 'vue'

// useSplashEffect shows a transient splash whenever the watched key changes to a
// new non-null value. The key doubles as the deduplication token, so the same
// event never replays; the splash auto-dismisses after `duration`.
//
// keySource is a ref/computed; delay may be a number or a function returning one
// (evaluated when the splash triggers).
export function useSplashEffect(keySource, {delay = 0, duration = 2000} = {}) {
    const visible = ref(false)
    let lastShownKey = null
    let showTimeout = null
    let hideTimeout = null

    function show() {
        showTimeout = null
        if (hideTimeout) {
            clearTimeout(hideTimeout)
        }

        visible.value = true
        hideTimeout = setTimeout(() => {
            visible.value = false
            hideTimeout = null
        }, duration)
    }

    watch(keySource, key => {
        if (!key || key === lastShownKey) {
            return
        }

        lastShownKey = key

        const wait = typeof delay === 'function' ? delay() : delay
        if (wait > 0) {
            showTimeout = setTimeout(show, wait)
        } else {
            show()
        }
    }, {immediate: true})

    onBeforeUnmount(() => {
        clearTimeout(showTimeout)
        clearTimeout(hideTimeout)
    })

    return { visible }
}
