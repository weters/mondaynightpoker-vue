<template>
    <form class="pass-the-poop inner" @submit.prevent="submit">
        <h4>Pass the Poop</h4>

        <game-selector-ante :min="25" :max="400" :step="25" v-model="ante"/>

        <label class="edition">
            <span>Edition</span>
            <select v-model="edition">
                <option value="standard">Standard</option>
                <option value="diarrhea">Diarrhea</option>
                <option value="pairs">Pairs</option>
            </select>
        </label>

        <label class="lives">
            <span>Lives</span>
            <select v-model="lives">
                <option value="3">3</option>
                <option value="2">2</option>
                <option value="1">1</option>
            </select>
        </label>

        <label class="optional allow-blocks">
            <span>Allow Blocks</span>

            <label class="optional radio">
                <input type="radio" name="allowBlocks" value="no" v-model="allowBlocks"/>
                <span>No</span>
            </label>
            <label class="optional radio">
                <input type="radio" name="allowBlocks" value="yes" v-model="allowBlocks"/>
                <span>Yes</span>
            </label>
        </label>

        <div class="buttons">
            <button>Start</button>
        </div>
    </form>
</template>

<script>
import GameSelectorAnte from "@/components/gameselector/GameSelectorAnte"

export default {
    name: "GameSelectorPassThePoop",
    components: {GameSelectorAnte},
    data() {
        return {
            ante: 150,
            edition: 'standard',
            lives: '3',
            allowBlocks: 'no',
        }
    },
    methods: {
        submit() {
            this.$emit('submit', {
                game: 'pass-the-poop',
                opts: {
                    ante: this.ante,
                    edition: this.edition,
                    lives: parseInt(this.lives, 10),
                    allowBlocks: this.allowBlocks === 'yes',
                },
            })
        },
    },
}
</script>

<style scoped>

</style>