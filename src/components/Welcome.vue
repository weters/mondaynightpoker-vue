<template>
    <div class="welcome main-box">
        <h2>Socially distant poker with your friends</h2>

        <p>Do you miss hanging out with your friends and slinging some cards around? Monday Night Poker lets you play your favorite dealer's choice poker games online and for free!</p>

        <p class="suits">
            <mdi-icon :icon="mdiCardsClub" />
            <mdi-icon :icon="mdiCardsDiamond" />
            <mdi-icon :icon="mdiCardsHeart" />
            <mdi-icon :icon="mdiCardsSpade" />
        </p>

        <p>Monday Night Poker is currently in <strong>Beta</strong>. Features are missing or may change without notice.</p>
    </div>
</template>

<script>
    import {mdiCardsClub, mdiCardsDiamond, mdiCardsHeart, mdiCardsSpade} from '@mdi/js'
    import MdiIcon from "./MdiIcon"

    export default {
        name: "Welcome",
        components: {MdiIcon},
        data() {
            return {
                mdiCardsClub,
                mdiCardsDiamond,
                mdiCardsHeart,
                mdiCardsSpade,
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../variables.scss';
    div.welcome {
        max-width: 650px;

        p svg {
            width: 24px;
            height: 24px;
        }

        p.suits {
            text-align: center;
        }

        p:last-child {
            margin: 0;
        }
    }
</style>