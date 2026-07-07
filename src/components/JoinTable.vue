<template>
  <div>
    <error-message
      v-if="error"
      :message="error"
    />
    <loading v-if="loading" />
  </div>
</template>

<script>
    import ErrorMessage from "@/components/ErrorMessage.vue"
    import Loading from "@/components/Loading.vue"
    import client from "@/client"

    export default {
        name: "JoinTable",
        components: {Loading, ErrorMessage},
        props: {
            uuid: {
                type: String,
                required: true,
            },
        },
        data() {
            return {
                loading: true,
                error: null,
            }
        },
        mounted() {
            client.joinTable(this.uuid)
                .catch(err => {
                    if (typeof(err) === 'object' && err.message && err.message === 'player is already at the table') {
                        return
                    }

                    return Promise.reject(err)
                })
                .then(() => this.$router.push(`/table/${encodeURIComponent(this.uuid)}`))
                .catch(err => this.error = err)
                .finally(() => this.loading = false)
        },
    }
</script>

<style scoped>

</style>