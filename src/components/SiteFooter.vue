<template>
  <footer>
    <div>
      <ul class="links">
        <li v-if="isSiteAdmin">
          <router-link to="/admin">
            Admin
          </router-link>
        </li>
        <li><a href="https://github.com/weters/mondaynightpoker-server">Source Code</a></li>
      </ul>
      <p class="copyright">
        &copy; 2021 Thomas Peters
      </p>
      <div class="version">
        <p class="vue-version">
          Site Version: <a :href="vueVersionUrl">{{ version }}</a>
        </p>
        <p class="server-version">
          Server Version: <a :href="serverVersionUrl">{{ serverVersion }}</a>
        </p>
      </div>
    </div>
  </footer>
</template>

<script>
import {mapState} from "pinia"
import client from "../client"
import {useRootStore} from "@/store"

export default {
    name: "MondayNightPokerFooter",
    data() {
        return {
            serverVersion: null,
            version: import.meta.env.VITE_APP_VERSION,
        }
    },
    computed: {
        ...mapState(useRootStore, ['isSiteAdmin']),
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
footer {
    background:   $surface-page;
    border-top:   1px solid $hairline;
    color:        $ink-muted;
    font-size:    $fs-sm;
    padding:      $spacing 0;

    a {
        color:           $accent;
        text-decoration: none;
        border-radius:   $radius-xs;

        &:hover {
            text-decoration:       underline;
            text-decoration-color: rgba($orange, 0.5);
        }

        &:focus-visible {
            @include focus-ring;
        }
    }

    p {
        margin: 0;
    }

    & > div {
        @include page-width;

        display:     flex;
        flex-wrap:   wrap;
        align-items: center;
        gap:         $space-2 $space-4;

        p.copyright {
            order: 1;
            color: $ink-faint;
        }

        ul.links {
            order:      2;
            list-style: none;
            padding:    0;
            margin:     0 0 0 auto;
            display:    flex;

            li {
                &:not(:first-child) {
                    margin-left: $space-4;
                }

                a {
                    @include tap-target;
                    display:     inline-flex;
                    align-items: center;
                }
            }
        }

        div.version {
            order:      3;
            flex:       0 0 100%;
            margin-top: $space-1;
            color:      $ink-faint;
            font-size:  $fs-xs;
        }

        @media (max-width: #{$mobile-max}) {
            display: block;

            ul.links {
                margin-bottom: $space-2;
            }
        }
    }
}
</style>