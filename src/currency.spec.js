import { describe, it, expect } from 'vitest'
import { formatAmount } from './currency'

describe('formatAmount', () => {
    it('formats whole dollars without cents', () => {
        expect(formatAmount(500)).toBe('$5')
        expect(formatAmount(10000)).toBe('$100')
    })

    it('formats fractional dollars with cents', () => {
        expect(formatAmount(525)).toBe('$5.25')
        expect(formatAmount(1)).toBe('$0.01')
    })

    it('formats negative amounts', () => {
        expect(formatAmount(-500)).toBe('-$5')
    })

    it('never renders negative zero', () => {
        expect(formatAmount(-0)).toBe('$0')
    })
})
