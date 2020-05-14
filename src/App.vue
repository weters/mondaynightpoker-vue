<template>
    <div id="body">
        <site-header />
        <main>
            <router-view/>
        </main>
        <site-footer />
    </div>
</template>

<script>
    import SiteHeader from "@/components/SiteHeader"
    import SiteFooter from "@/components/SiteFooter"

    export default {
        name: 'App',
        components: {SiteHeader, SiteFooter},
    }
</script>

<style lang="scss">
    @import url('https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,700;1,800&family=Libre+Baskerville:wght@700&family=Source+Sans+Pro:wght@400;700&display=swap');
    @import './variables';

    * {
        padding:                  0;
        margin:                   0;
        box-sizing:               border-box;
        outline:                  none;

        -moz-text-size-adjust:    100%;
        -ms-text-size-adjust:     100%;
        -webkit-text-size-adjust: 100%;
        text-size-adjust:         100%;
    }

    html, body {
        background-color: $background-color;
        color: $text-color;
        font-family: $font-text;
        height: 100%;
    }

    #body {
        display: flex;
        flex-direction: column;
        height: 100%;

        header {
            flex-shrink: 0;
        }
        main {
            flex: 1 0 auto;
        }
        footer {
            flex-shrink: 0;
        }
    }

    h1, h2, h3, h4, h5, h6 {
        font-family: $font-header;
        font-weight: 800;
    }

    h1 {
        font-style: italic;
        font-variation-settings: 'ital' 1;
    }

    h1, h2, h3, h4, h5, h6, table, ul, ol, p {
        margin-bottom: $spacing;
    }

    ul, ol {
        margin-left: 45px;
    }

    main {
        padding: $spacing;
    }

    form {
        overflow: hidden;
        background-color: white;
        border: 1px solid $border-color;
        border-radius: $border-radius;
        padding: $spacing;
        margin: 0 auto;
        width: min-content;
        position: relative;

        h2 {
            white-space: nowrap;
        }

        & > div.buttons:last-child {
            margin-bottom: 0;
        }
    }

    label {
        $width: 250px;
        display: block;
        margin-bottom: $spacing;
        width: $width;

        &:not(.optional) span:not(.container)::after {
            content: '*';
            color: $error;

            @at-root.hide-required & {
                content: '';
            }
        }

        & > span {
            display: block;
        }

        input:not([type="checkbox"]) {
            background-color: white;
            border-radius: $border-radius;
            border: 1px solid $border-color;
            color: $text-color;
            font-family: $font-text;
            font-size: 16px;
            height: 30px;
            padding: 2px 8px;
            width: $width;

            &:disabled {
                background-color: transparent;
            }

            &:focus {
                border: 2px solid $primary;
                color: $primary;
                padding: 1px 7px;
            }

            &::placeholder {
                color: #ccc;
            }
        }
    }

    button {
        box-shadow: 2px 2px 2px rgba(black, 0.2), 0 0 4px rgba(black, 0.2);
        background-color: $primary;
        border-width: 0;
        border-radius: $border-radius;
        padding: 8px 12px;
        color: white;
        font-family: $font-text;
        font-size: 1em;
        font-weight: bold;
        transition: all 250ms;

        &.global {
            background-color: $secondary;
        }

        &.secondary {
            background-color: transparent;
            box-shadow: none;
            color: $primary;
        }

        &:disabled {
            box-shadow: none;
            opacity: 0.2;
        }

        &:active {
            background-color: darken($primary, 5%);
            box-shadow: none;
        }
    }

    div.buttons {
        margin-bottom: $spacing;
        text-align: center;

        button:not(:first-child) {
            margin-left: $spacing-medium;
        }
    }

    .error-enter-active, .error-leave-active {
        transition: all 250ms;
    }

    .error-enter, .error-leave-to {
        opacity: 0;
        transform: scale(.8);
    }

    a {
        color: $primary;

        &:visited {
            color: $text-color;
        }
    }

    table.standard {
        padding: $spacing;
        border-radius: $border-radius;
        border-collapse: collapse;

        th, td {
            padding: 4px 12px;
        }

        th {
            border-bottom: 2px solid $border-color;
        }

        tbody tr:nth-child(odd) {
            background-color: darken($background-color, 3%);
        }

        td {
            border-bottom: 1px solid $border-color;

            &.boolean {
                text-align: center;
            }

            &.number {
                text-align: right;
            }

            &.center {
                text-align: center;
            }
        }
    }
</style>
