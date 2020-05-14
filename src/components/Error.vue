<template>
    <div class="container">
        <div class="error">
            <p>{{ formattedMessage }}</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Error",
        props: {
            message: {
                required: true,
            },
        },
        computed: {
            formattedMessage() {
                return typeof (this.message) === 'object' && this.message.message ? this.message.message : this.message
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import '../variables';

    div.error {
        p {
            border-left:  3px solid $error;
            padding-left: $spacing-medium;

            &::before {
                content:     'ERROR';
                display:     block;
                font-weight: bold;
                font-size:   0.6em;
            }
        }
    }
</style>