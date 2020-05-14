<template>
    <div class="bourre-hand">
        <bourre-card-picker
                :can-select="true"
                :max-select="1"
                v-model="selected"
                :round="round"
        />

        <div class="buttons">
            <button v-if="isTurn" :disabled="selected.length === 0" @click="playCard">Play Card</button>
            <button v-if="isRoundOver" class="global" @click="endRound">End Round</button>
            <button v-if="isGameOver" class="global" @click="done">Done</button>
        </div>
    </div>
</template>

<script>
    import BourreCardPicker from "@/components/games/BourreCardPicker"
    import {mapGetters} from "vuex"

    export default {
        name: "BourreHand",
        components: {BourreCardPicker},
        props: {
            hand: {
                type: Array,
                required: true,
            },
        },
        data() {
            return {
                selected: [],
            }
        },
        computed: {
            ...mapGetters({
                round: 'bourre/round',
                isTurn: 'bourre/isTurn',
                isRoundOver: 'bourre/isRoundOver',
                isGameOver: 'bourre/isGameOver',
            }),
        },
        watch: {
            round() {
                this.selected = []
            },
        },
        methods: {
            playCard() {
                this.$store.state.webSocket.send('playCard', null, this.selected)
                    .then(res => console.log(res))
                    .catch(err => {
                        this.$emit('error', err)
                    })
            },
            endRound() {
                this.$store.state.webSocket.send('nextRound')
                    .then(res => console.log('nextRound', res))
                    .catch(err => this.error = err)
            },
            done() {
                this.$store.state.webSocket.send('done')
                    .then(res => console.log('done', res))
                    .catch(err => this.error = err)
            },
        },
    }
</script>

<style scoped>

</style>