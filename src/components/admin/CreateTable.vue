<template>
    <div class="create-table small-content">
        <div>
            <h2>Create a Table</h2>

            <form @submit.prevent="submit">
                <error :message="error" v-if="error"/>

                <fancy-input label="Table Name" type="text" autocomplete="off" required v-model="name" :disabled="loading" />

                <div class="buttons">
                    <button type="submit" :disabled="loading">Create</button>
                </div>

                <loading v-if="loading"/>
            </form>
        </div>
    </div>
</template>

<script>
import Error from "@/components/Error"
import Loading from "@/components/Loading"
import client from "@/client"
import FancyInput from "@/components/formelements/FancyInput"

export default {
    name: "CreateTable",
    components: {FancyInput, Loading, Error},
    data() {
        return {
            loading: false,
            name: null,
            error: null,
        }
    },
    methods: {
        submit() {
            this.loading = true
            client.createTable(this.name)
                .then(res => this.$router.push(`/table/${encodeURIComponent(res.uuid)}`))
                .catch(err => this.error = err)
                .finally(() => this.loading = false)
        },
    },
}
</script>

<style scoped>
</style>