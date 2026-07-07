import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { computed, defineComponent, h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { useDealAnimation } from './useDealAnimation'

function harness({cards, order = 0, participantCount = 3, isOpeningDeal = true}) {
    let result
    const Comp = defineComponent({
        setup() {
            result = useDealAnimation({
                cards,
                order: computed(() => order),
                participantCount: computed(() => participantCount),
                isOpeningDeal: computed(() => isOpeningDeal),
                dealDelay: 100,
            })
            return () => h('div')
        },
    })
    const wrapper = mount(Comp)
    return {wrapper, result}
}

describe('useDealAnimation', () => {
    beforeEach(() => vi.useFakeTimers())
    afterEach(() => vi.useRealTimers())

    it('reveals the opening deal one card at a time, staggered by seat order', () => {
        const cards = ref(['2s', '3h', '4d'])
        const {result} = harness({cards, order: 1, participantCount: 3})

        // one card shows immediately
        expect(result.hand.value).toEqual(['2s'])

        // next card lands after 250ms + order * dealDelay
        vi.advanceTimersByTime(250 + 100)
        expect(result.hand.value).toEqual(['2s', '3h'])

        // subsequent cards are spaced by participantCount * dealDelay
        vi.advanceTimersByTime(300)
        expect(result.hand.value).toEqual(['2s', '3h', '4d'])
    })

    it('shows the full hand immediately mid-game', () => {
        const cards = ref(['2s', '3h', '4d', '5c'])
        const {result} = harness({cards, isOpeningDeal: false})

        expect(result.hand.value).toEqual(['2s', '3h', '4d', '5c'])
    })

    it('animates newly dealt cards in', async () => {
        const cards = ref(['2s'])
        const {result} = harness({cards, order: 0, participantCount: 2, isOpeningDeal: false})
        expect(result.hand.value).toEqual(['2s'])

        cards.value = ['2s', '9c']
        await vi.advanceTimersByTimeAsync(0)
        vi.advanceTimersByTime(0)
        expect(result.hand.value).toEqual(['2s', '9c'])
    })

    it('clears the hand when the cards go away', async () => {
        const cards = ref(['2s'])
        const {result} = harness({cards, isOpeningDeal: false})

        cards.value = null
        await vi.advanceTimersByTimeAsync(0)
        expect(result.hand.value).toEqual([])
    })

    it('stops the animation on unmount', () => {
        const cards = ref(['2s', '3h', '4d'])
        const {wrapper, result} = harness({cards, order: 0, participantCount: 3})

        wrapper.unmount()
        vi.advanceTimersByTime(5000)
        expect(result.hand.value).toEqual(['2s'])
    })
})
