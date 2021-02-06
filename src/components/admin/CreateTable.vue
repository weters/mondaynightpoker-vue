<template>
    <div class="create-table main-box">
        <h2>Create a Table</h2>

        <form @submit.prevent="submit" >
            <error :message="error" v-if="error"/>

            <label>
                <span>Name</span>
                <input type="text" autocomplete="off" required v-model="name" :disabled="loading">
            </label>

            <div class="buttons">
                <button type="submit" :disabled="loading">Create</button>
            </div>

            <loading v-if="loading"/>
        </form>
    </div>
</template>

<script>
    import Error from "@/components/Error"
    import Loading from "@/components/Loading"
    import client from "@/client"

    export default {
        name: "CreateTable",
        components: {Loading, Error},
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
    form {
        width: min-content;
    }
</style>