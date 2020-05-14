const formatter = new Intl.NumberFormat('en-US', {
   style: 'currency',
   currency: 'USD',
})

export default {
    methods: {
        formatAmount(cents) {
            const dollars = cents / 100
            return formatter.format(dollars)
        }
    }
}