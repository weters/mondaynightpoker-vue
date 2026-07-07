import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

// useDealAnimation progressively reveals a participant's cards, staggered by seat
// order so the deal appears to sweep around the table.
//
// cards/order/participantCount/isOpeningDeal are refs or computeds; the returned
// `hand` is what the template should render.
export function useDealAnimation({cards, order, participantCount, isOpeningDeal, dealDelay = 200}) {
    const hand = ref([])
    let timeout = null

    function addCard() {
        timeout = null

        const actual = cards.value
        if (!actual) {
            return
        }

        const shown = hand.value.length
        if (shown === actual.length) {
            hand.value = actual
            return
        }

        hand.value = [...actual.slice(0, shown + 1)]
        if (shown + 1 < actual.length) {
            timeout = setTimeout(addCard, participantCount.value * dealDelay)
        }
    }

    onMounted(() => {
        if (isOpeningDeal.value) {
            if (cards.value) {
                hand.value = cards.value.slice(0, 1)
            }

            timeout = setTimeout(addCard, 250 + order.value * dealDelay)
        } else {
            hand.value = cards.value || []
        }
    })

    watch(cards, newCards => {
        if (!newCards) {
            hand.value = []
            return
        }

        if (!timeout) {
            timeout = setTimeout(addCard, order.value * dealDelay)
        }
    })

    onBeforeUnmount(() => {
        if (timeout) {
            clearTimeout(timeout)
        }
    })

    return { hand }
}
