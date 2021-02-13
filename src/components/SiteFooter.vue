<template>
    <footer>
        <div>
            <ul class="links">
                <li><router-link to="/admin" v-if="$store.getters.isSiteAdmin">Admin</router-link></li>
                <li><a href="https://github.com/weters/mondaynightpoker-server">Source Code</a></li>
            </ul>
            <p class="copyright">&copy; 2021 Thomas Peters</p>
            <div class="version">
                <p class="vue-version">Site Version: <a :href="vueVersionUrl">{{ version }}</a></p>
                <p class="server-version">Server Version: <a :href="serverVersionUrl">{{ serverVersion }}</a></p>
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
            return 'https://github.com/weters/mondaynightpoker-vue'
        },
        serverVersionUrl() {
            return 'https://github.com/weters/mondaynightpoker-server'
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

footer {
    color: $text-color-light;
    font-size: 0.8em;
    margin-top: $spacing * 4;
    padding: $spacing 0;

    a {
        color: $green;
        text-decoration: none;
    }

    p {
        margin: 0;
    }

    & > div {
        @include page-width;

        display: flex;
        flex-wrap: wrap;

        p.copyright {
            order: 1;
        }

        ul.links {
            order: 2;
            list-style: none;
            padding: 0;
            margin: 0 0 0 auto;
            display: flex;
            li {
                &:not(:first-child) {
                    margin-left: $spacing;
                }
            }
        }

        div.version {
            order: 3;
            flex: 0 0 100%;
            margin-top: $spacing-medium;
        }

        @media (max-width: #{$mobile-max}) {
            display: block;

            ul.links {
                margin-bottom: $spacing-medium;
            }
        }
    }
}
</style>