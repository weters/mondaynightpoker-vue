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
        </div>
    </div>
</template>

<script>
    import BourreCardPicker from "@/components/games/bourre/BourreCardPicker"
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
        },
    }
</script>

<style scoped>
    div.buttons {
        white-space: nowrap;
    }
</style>