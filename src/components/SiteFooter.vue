<template>
    <footer>
        <div>
            <p class="copyright">
                &copy; 2020 Tom Peters
            </p>
            <p class="version">{{ version }}</p>
        </div>
    </footer>
</template>

<script>
    export default {
        name: "MondayNightPokerFooter",
        data() {
            return {
                version: process.env.VUE_APP_VERSION || 'v0.0.0',
            }
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
        }
    }
</style>