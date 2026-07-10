<template>
  <header>
    <div>
      <h1>
        <router-link to="/">
          <span>Monday Night Poker</span>
        </router-link>
      </h1>

      <ul>
        <template v-if="user">
          <li>
            <router-link to="/my-tables">
              My Tables
            </router-link>
          </li>
          <li>
            <router-link to="/my-profile">
              My Profile
            </router-link>
          </li>
          <li>
            <router-link to="/logout">
              Log Out
            </router-link>
          </li>
        </template>
        <template v-else>
          <li>
            <router-link to="/signup">
              Sign Up
            </router-link>
          </li>
          <li>
            <router-link to="/login">
              Log In
            </router-link>
          </li>
        </template>
      </ul>
    </div>
  </header>
</template>

<script>
import {mapState} from "pinia"
import {useRootStore} from "@/store"

export default {
    name: "MondayNightPokerHeader",
    computed: {
        ...mapState(useRootStore, ['user']),
    },
}
</script>

<style lang="scss" scoped>
header {
    position:   relative;
    background: $surface-header;
    color:      $on-felt;
    height:     74px;
    box-shadow: 0 1px 0 rgba(#000, 0.3);

    $max-width: 650px;

    @media (max-width: #{$max-width}) {
        height:  auto;
        padding: $space-3 0;
    }

    & > div {
        display:     flex;
        align-items: center;
        @include page-width;

        @media (max-width: #{$max-width}) {
            display: block;
        }

        a {
            color:           $on-felt;
            text-decoration: none;
        }

        h1 {
            margin:         0;
            padding:        0;
            height:         74px;
            line-height:    74px;
            font-family:    $font-display;
            font-size:      $fs-lg;
            font-weight:    $fw-regular;
            letter-spacing: $tracking-wide;

            @media (max-width: #{$max-width}) {
                height:      auto;
                line-height: $lh-snug;
                text-align:  center;
                padding:     $space-2 0 $space-3;
            }

            a {
                display:       inline-flex;
                align-items:   center;
                border-radius: $radius-xs;

                &:focus-visible {
                    @include focus-ring-on-felt;
                }
            }
        }

        ul {
            list-style:  none;
            margin:      0 0 0 auto;
            padding:     0;
            display:     flex;
            align-items: center;
            font-weight: $fw-semibold;
            font-size:   $fs-sm;

            @media (max-width: #{$max-width}) {
                margin:          0 0 $space-2;
                justify-content: center;
                flex-wrap:       wrap;
            }

            li {
                &:not(:first-child) {
                    margin-left: $space-2;
                }

                a {
                    @include tap-target;
                    display:       inline-flex;
                    align-items:   center;
                    padding:       0 $space-3;
                    border-radius: $radius-xs;
                    transition:    color $dur-fast $ease-standard, box-shadow $dur-fast $ease-standard;

                    &:hover {
                        color: $peach;
                    }

                    &:focus-visible {
                        @include focus-ring-on-felt;
                    }

                    &.router-link-active {
                        box-shadow: inset 0 -2px 0 $accent;
                    }

                    @media (prefers-reduced-motion: reduce) {
                        transition: color $dur-fast linear;
                    }
                }
            }
        }
    }
}
</style>