<template>
    <form class="little-l inner" @submit.prevent="submit">
        <h4>Little L</h4>

        <game-selector-ante :min="25" :max="200" :step="25" v-model="ante"/>

        <div class="initial-deal">
            <span>Initial deal</span>

            <label class="optional radio">
                <input type="radio" v-model="initialDeal" value="3"/>
                <span>3</span>
            </label>

            <label class="optional radio">
                <input type="radio" v-model="initialDeal" value="4"/>
                <span>4</span>
            </label>
        </div>

        <div class="trade-ins">
            <span>Trade-ins</span>

            <label v-for="i in 5" :key="i" class="optional checkbox"><input type="checkbox"
                                                                            :value="i-1"
                                                                            v-model="tradeIns"
                                                                            :disabled="i - 1 > parseInt(initialDeal, 10)"
            /><span>{{
                    i - 1
                }}</span></label>
        </div>

        <div class="buttons">
            <button>Start</button>
        </div>
    </form>
</template>

<script>
import GameSelectorAnte from "@/components/gameselector/GameSelectorAnte"

export default {
    name: "GameSelectorLittleL",
    components: {GameSelectorAnte},
    data() {
        return {
            ante: 25,
            tradeIns: ['0', '2'],
            initialDeal: '4',
        }
    },
    methods: {
        submit() {
            this.$emit('submit', {
                game: 'little-l',
                opts: {
                    ante: this.ante,
                    tradeIns: this.tradeIns.map(v => parseInt(v, 10)),
                    initialDeal: this.parseInt(this.initialDeal, 10),
                },
            })
        },
    },
}
</script>

<style lang="scss" scoped>
@import '../../variables.scss';

form.little-l {
    .trade-ins {
        margin-top: $spacing-medium;
    }
}
</style>