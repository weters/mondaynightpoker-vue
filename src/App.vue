<template>
    <div id="body">
        <site-header/>
        <main>
            <router-view/>
        </main>
        <site-footer/>
        <error-banner/>
        <dev-tools v-if="!production"/>
    </div>
</template>

<script>
import SiteHeader from "@/components/SiteHeader"
import SiteFooter from "@/components/SiteFooter"
import ErrorBanner from "./components/ErrorBanner"
import DevTools from "@/components/DevTools"

export default {
    name: 'App',
    components: {DevTools, ErrorBanner, SiteHeader, SiteFooter},
    computed: {
        production() {
            return process.env.NODE_ENV === 'production'
        },
    },
}
</script>

<style lang="scss">
@import url("https://use.typekit.net/ukr2lpr.css");
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
    color:            $text-color;
    font-family:      $font-text;
    height:           100%;
}

#body {
    display:        flex;
    flex-direction: column;
    height:         100%;

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
    font-family: $font-text;
    font-weight: bold;
}


h1, h2, h3, h4, h5, h6, table, ul, ol, p {
    margin-bottom: $spacing;
}

h2 {
    font-size: 2em;
}

h3 {
    border-bottom: 1px solid $dark-green;
    font-weight:   normal;
    font-size:     1.6em;
}

ul, ol {
    margin-left: 45px;
}

main {
    & > .small-content {
        background: linear-gradient(#011f26, #011f26 120px, $background-color 121px);
        overflow:   auto;

        & > * {
            background-color: white;
            max-width:        600px;
            padding:          $spacing;
            margin:           $spacing auto 0;
        }
    }

    & > .big-content {
        background: linear-gradient(#011f26, #011f26 120px, $background-color 121px);
        overflow:   auto;

        & > * {
            @include page-width;
            background-color: white;
            padding:          $spacing;
            margin-top:       $spacing;

            @media (max-width: #{$page-width-max-width}) {
                margin-top: 0;
            }
        }
    }
}

.error-enter-active, .error-leave-active {
    transition: all 250ms;
}

.error-enter, .error-leave-to {
    opacity:   0;
    transform: scale(.8);
}

a {
    color: $orange;

    &:visited {
        color: $text-color;
    }
}

table.standard {
    border-collapse: collapse;

    tr {
        border-bottom: 1px solid $border-color;
    }

    thead th {
        padding:             12px 4px;
        border-bottom-color: $dark-green;
    }

    td {
        padding: 4px;
    }

    tr:nth-child(even) {
        background-color: $gray;
    }

    @media (max-width: #{ $media-small-table-width }) {
        padding: 0;

        thead {
            display: none;
        }

        &, tbody, tr, td {
            display: block;
            width:   100%;
        }

        tr {
            border-bottom: 1px solid $dark-green;
        }

        td {
            position:     relative;
            text-align:   left;
            padding-left: 40%;
            white-space:  nowrap;

            &::before {
                color:        $text-color-light;
                width:        calc(40% - #{$spacing-medium});
                position:     absolute;
                left:         0;
                padding-left: $spacing-small;
            }
        }
    }
}

@mixin button {
    padding:          7px 14px;
    font-weight:      bold;
    background-color: $orange;
    text-decoration:  none;
    border-radius:    4px;
    color:            white;
    font-size:        1.0em;

    &:active {
        background-color: darken($orange, 10%);
    }

    &:disabled {
        opacity: 0.1;
    }
}

a.button {
    display: inline-block;
    @include button;
}

button:not(.icon) {
    @include button;
    border-width: 0;

    &.secondary {
        background-color: transparent;
        color:            $orange;
    }
}

button.icon {
    border:           none;
    padding:          0;
    background-color: transparent;

    path {
        fill: $orange;
    }

    &:active path {
        fill: darken($orange, 10%);
    }

    &:disabled, &:disabled:active {
        opacity: 0.2;

        & path {
            fill: $orange;
        }
    }
}

label {
    display:       block;
    margin-bottom: $spacing;

    select {
        appearance:          none;
        -webkit-appearance:  none;
        -moz-appearance:     none;
        padding:             14px;
        font-size:           16px;
        font-family:         $font-text;
        border:              1px solid $border-color;
        border-radius:       0;
        background-color:    #fff;
        background-image:    url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCBtZWV0IiB2aWV3Qm94PSIwIDAgNDAwIDMwMCIgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiPjxkZWZzPjxwYXRoIGQ9Ik0yMDAgMjk5LjE2TDQwMCAwTDAgMEwyMDAgMjk5LjE2WiIgaWQ9ImRzOUpFd3NLIj48L3BhdGg+PC9kZWZzPjxnPjxnPjxnPjx1c2UgeGxpbms6aHJlZj0iI2RzOUpFd3NLIiBvcGFjaXR5PSIxIiBmaWxsPSIjY2NjY2NjIiBmaWxsLW9wYWNpdHk9IjEiPjwvdXNlPjwvZz48L2c+PC9nPjwvc3ZnPg==');
        background-repeat:   no-repeat;
        background-position: right .7em center;
        background-size:     .65em;
        color:               $green;

        &::-ms-expand {
            display: none;
        }
    }

    input[type="text"], input[type="password"], input[type="number"] {
        -webkit-appearance: none;
        -moz-appearance:    none;
        appearance:         none;

        border:             1px solid $border-color;
        border-radius:      0;
        color:              $green;
        font-family:        $font-text;
        font-size:          16px;
        padding:            14px;
        width:              100%;

        &::placeholder {
            color: #aaaaaa;
        }
    }
}

div.buttons {
    text-align: right;

    & button:not(:first-child) {
        margin-left: $spacing-medium;
    }
}
</style>
