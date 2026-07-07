import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { useSplashEffect } from './useSplashEffect'

function harness(keyRef, options) {
    let result
    const Comp = defineComponent({
        setup() {
            result = useSplashEffect(keyRef, options)
            return () => h('div')
        },
    })
    const wrapper = mount(Comp)
    return {wrapper, result}
}

describe('useSplashEffect', () => {
    beforeEach(() => vi.useFakeTimers())
    afterEach(() => vi.useRealTimers())

    it('shows when the key becomes non-null and auto-dismisses', async () => {
        const key = ref(null)
        const {result} = harness(key)

        expect(result.visible.value).toBe(false)

        key.value = 42
        await vi.advanceTimersByTimeAsync(0)
        expect(result.visible.value).toBe(true)

        vi.advanceTimersByTime(2000)
        expect(result.visible.value).toBe(false)
    })

    it('shows immediately for an initially non-null key', () => {
        const {result} = harness(ref('initial'))
        expect(result.visible.value).toBe(true)
    })

    it('does not replay the same key', async () => {
        const key = ref('a')
        const {result} = harness(key)
        vi.advanceTimersByTime(2000)
        expect(result.visible.value).toBe(false)

        key.value = null
        await vi.advanceTimersByTimeAsync(0)
        key.value = 'a'
        await vi.advanceTimersByTimeAsync(0)
        expect(result.visible.value).toBe(false)

        key.value = 'b'
        await vi.advanceTimersByTimeAsync(0)
        expect(result.visible.value).toBe(true)
    })

    it('honors a delay function', async () => {
        const key = ref(null)
        const {result} = harness(key, {delay: () => 450})

        key.value = 'later'
        await vi.advanceTimersByTimeAsync(0)
        expect(result.visible.value).toBe(false)

        vi.advanceTimersByTime(450)
        expect(result.visible.value).toBe(true)
    })

    it('cleans up timers on unmount', async () => {
        const key = ref(null)
        const {wrapper, result} = harness(key, {delay: 100})
        key.value = 'x'
        await vi.advanceTimersByTimeAsync(0)

        wrapper.unmount()
        vi.advanceTimersByTime(5000)
        expect(result.visible.value).toBe(false)
    })
})
