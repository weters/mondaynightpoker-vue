export default {
    methods: {
        showError(err) {
            if (this.errorTimeout) {
                clearTimeout(this.errorTimeout)
            }

            this.error = err
            this.errorTimeout = setTimeout(() => {
                this.error = null
            }, 2000)
        },
    },
}