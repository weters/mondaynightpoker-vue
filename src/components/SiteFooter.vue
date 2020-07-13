<template>
    <footer>
        <div>
            <p class="copyright">
                &copy; 2020 Tom Peters
            </p>
            <div class="version">
                <span class="vue-version"><a :href="vueVersionUrl">{{ version }}</a></span>
                <span class="server-version"><a :href="serverVersionUrl">{{ serverVersion }}</a></span>
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
        computed: {
            vueVersionUrl() {
                return this.githubUrl('https://github.com/weters/mondaynightpoker-vue', this.version)
            },
            serverVersionUrl() {
                return this.githubUrl('https://github.com/weters/mondaynightpoker-server', this.serverVersion)
            },
        },
        methods: {
            githubUrl(base, version) {
                if (!version) {
                    return base
                }

                let match = version.match(/^(v\d+\.\d+\.\d+)(?:-\d+-g([a-f0-9]+))?/)
                if (!match) {
                    return base
                }

                if (match[2]) {
                    return `${base}/commit/${match[2]}`
                }

                return `${base}/releases/tag/${match[1]}`
            },
        },
        mounted() {
            client.getServerInfo()
                .then(res => this.serverVersion = res.version)
                .catch(() => {
                })
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

                a {
                    color: $text-color-light;
                }

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