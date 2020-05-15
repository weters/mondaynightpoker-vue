<template>
    <header>
        <h1><router-link to="/"><mdi-icon :icon="mdiCardsPlayingOutline" /><span>Monday Night Poker</span></router-link></h1>

        <ul>
            <li v-if="isSiteAdmin"><router-link to="/admin">Admin</router-link></li>
            <template v-if="user">
                <li><router-link to="/table">Your Tables</router-link></li>
                <li><router-link to="/profile">My Profile</router-link></li>
                <li><router-link to="/logout">Log Out</router-link></li>
            </template>
            <template v-else>
                <li><router-link to="/signup">Sign Up</router-link></li>
                <li><router-link to="/login">Log In</router-link></li>
            </template>
        </ul>
    </header>
</template>

<script>
    import {mapGetters, mapState} from "vuex"
    import MdiIcon from "@/components/MdiIcon"
    import { mdiCardsPlayingOutline } from '@mdi/js'

    export default {
        name: "MondayNightPokerHeader",
        components: {MdiIcon},
        data() {
            return { mdiCardsPlayingOutline }
        },
        computed: {
            ...mapState(['user']),
            ...mapGetters(['isSiteAdmin']),
        },
    }
</script>

<style lang="scss" scoped>
    @import '../variables';
    header {
        background-color: #171717;
        color: white;
        position: relative;
        @media (min-width: 800px) {
            display: flex;
        }
        align-items: center;
        padding: $spacing;

        h1 {
            filter: drop-shadow(2px 1px black) drop-shadow(2px 1px $primary) drop-shadow(2px 1px $secondary);

            font-size: 2.4em;
            margin: 0;

            svg {
                height: 1.0em;
                vertical-align: middle;
                fill: white;
            }

            @media (max-width: 800px) {
                font-size: 1.4em;
                margin-bottom: $spacing-medium;
            }

            span {
                &::before {
                    content: ' ';
                }
                vertical-align: middle;
            }

            a {
                color: white;
                text-decoration: none;
            }
        }

        ul {
            list-style: none;
            margin: 0 0 0 auto;
            text-align: center;
            li {
                display: inline-block;
                margin-left: $spacing-medium;

                &:first-child {
                    margin-left: 0;
                }

                a {
                    color: white;
                    display: block;
                    font-weight: bold;
                    text-decoration: none;
                }
            }
        }
    }
</style>