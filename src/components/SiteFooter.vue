<template>
    <footer>
        <div>
            <p class="copyright">
                &copy; 2020 Tom Peters
            </p>
            <div class="version">
                <span class="vue-version">{{ version }}</span>
                <span class="server-version">{{ serverVersion }}</span>
            </div>
        </div>
    </footer>
</template>

<script>
    import client from "../client"

    export default {
        name: "MondayNightPokerFooter",
        data() {
            return {
                serverVersion: null,
                version: process.env.VUE_APP_VERSION || 'v0.0.0',
            }
        },
        mounted() {
            client.getServerInfo()
                .then(res => this.serverVersion = res.version)
                .catch(() => {})
        },
    }
</script>

<style lang="scss" scoped>
    @import '../variables.scss';

    footer > div {
        color:     $text-color-light;
        display:   flex;
        font-size: 0.8em;
        padding:   $spacing;
        margin:    0 auto;
        max-width: 800px;

        & > :nth-child(2) {
            margin-left: auto;

            span {
                display: block;

                &.vue-version::before {
                    content: 'Site: '
                }

                &.server-version::before {
                    content: 'Server: '
                }
            }
        }
    }
</style>