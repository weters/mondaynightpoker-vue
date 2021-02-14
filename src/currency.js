const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
})

export const formatAmount = (cents) => {
    const dollars = cents / 100
    return formatter.format(dollars).replace(/.00$/, '')
}