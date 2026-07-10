<template>
  <div class="join-table small-content">
    <div class="join-table-inner">
      <error-message
        v-if="error"
        :message="error"
      />
      <div
        v-if="loading"
        class="join-table-loading"
      >
        <loading />
        <p class="note">
          Joining the table&hellip;
        </p>
      </div>
    </div>
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

<style lang="scss" scoped>
.join-table-loading {
    display:        flex;
    flex-direction: column;
    align-items:    center;
    gap:            $space-4;
    padding:        $space-8 0;
    text-align:     center;

    .note {
        margin: 0;
    }
}
</style>