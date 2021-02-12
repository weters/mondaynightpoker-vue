<template>
    <header>
        <div>
            <h1>
                <router-link to="/"><span>Monday Night Poker</span></router-link>
            </h1>

            <ul>
                <template v-if="user">
                    <li>
                        <router-link to="/my-tables">My Tables</router-link>
                    </li>
                    <li>
                        <router-link to="/my-profile">My Profile</router-link>
                    </li>
                    <li>
                        <router-link to="/logout">Log Out</router-link>
                    </li>
                </template>
                <template v-else>
                    <li>
                        <router-link to="/signup">Sign Up</router-link>
                    </li>
                    <li>
                        <router-link to="/login">Log In</router-link>
                    </li>
                </template>
            </ul>
        </div>
    </header>
</template>

<script>
import {mapState} from "vuex"

export default {
    name: "MondayNightPokerHeader",
    computed: {
        ...mapState(['user']),
    },
}
</script>

<style lang="scss" scoped>
@import '../variables';

header {
    background-color: #011f26;
    color:            white;
    height:           74px;

    $max-width: 650px;

    @media (max-width: #{$max-width}) {
        height: auto;
    }

    & > div {
        display:     flex;
        align-items: center;
        @include page-width;

        @media (max-width: #{$max-width}) {
            display: block;
        }

        a {
            color:           white;
            text-decoration: none;
        }

        h1 {
            font-family: gioviale, sans-serif;
            line-height: 74px;
            height:      74px;
            margin:      0;
            padding:     0;
        }

        ul {
            list-style:  none;
            margin:      0 0 0 auto;
            padding:     0;
            display:     flex;
            font-weight: bold;

            @media (max-width: #{$max-width}) {
                margin: 0 0 $spacing;

                justify-content: center;
            }

            li {
                font-size:   0.9em;

                &:not(:first-child) {
                    margin-left: $spacing;
                }
            }
        }
    }
}
</style>