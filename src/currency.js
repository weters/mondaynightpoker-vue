const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
})

export const formatAmount = (cents) => {
    if (cents === 0) {
        cents = 0 // make sure we get rid of -0
    }

    const dollars = cents / 100
    return formatter.format(dollars).replace(/.00$/, '')
}