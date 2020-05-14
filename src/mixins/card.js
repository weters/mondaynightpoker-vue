export default {
    methods: {
        cardId(card) {
            return `${card.rank}.${card.suit}`
        },
        cardByCardId(cardId) {
            const [rank, suit] = cardId.split(".")
            return {
                rank: parseInt(rank, 10),
                suit
            }
        }
    }
}