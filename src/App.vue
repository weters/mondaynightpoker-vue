<template>
  <div id="body">
    <site-header />
    <main>
      <router-view :key="$route.path" />
    </main>
    <site-footer />
    <error-banner />
    <notification-banner />
    <dev-tools v-if="!production" />
  </div>
</template>

<script>
import SiteHeader from "@/components/SiteHeader.vue"
import SiteFooter from "@/components/SiteFooter.vue"
import ErrorBanner from "./components/ErrorBanner.vue"
import DevTools from "@/components/DevTools.vue"
import NotificationBanner from "@/components/NotificationBanner.vue"

export default {
    name: 'App',
    components: {NotificationBanner, DevTools, ErrorBanner, SiteHeader, SiteFooter},
    computed: {
        production() {
            return import.meta.env.PROD
        },
    },
}
</script>

<style lang="scss">
@use 'sass:color';
@import url("https://use.typekit.net/ukr2lpr.css");
* {
    padding:                  0;
    margin:                   0;
    box-sizing:               border-box;

    -moz-text-size-adjust:    100%;
    -ms-text-size-adjust:     100%;
    -webkit-text-size-adjust: 100%;
    text-size-adjust:         100%;
}

// Focus policy: keyboard users always see the canonical ring;
// mouse/touch users don't get an outline on click.
:focus-visible {
    @include focus-ring;
}

:focus:not(:focus-visible) {
    outline: none;
}

html, body {
    background:               $surface-page;
    color:                    $ink;
    font-family:              $font-text;
    height:                   100%;
    -webkit-font-smoothing:   antialiased;
    text-rendering:           optimizeLegibility;
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
    font-family:    $font-text;
    font-weight:    $fw-bold;
    line-height:    $lh-tight;
    letter-spacing: $tracking-tight;
    color:          $ink;
}


h1, h2, h3, h4, h5, h6, table, ul, ol, p {
    margin-bottom: $spacing;
}

h2 {
    font-size: $fs-xl;
}

h3 {
    font-size:      $fs-lg;
    font-weight:    $fw-semibold;
    border-bottom:  1px solid $hairline;
    padding-bottom: $spacing-small;
}

ul, ol {
    margin-left: 45px;
}

main {
    & > .small-content {
        background: linear-gradient($surface-header, $surface-header 120px, $surface-page 121px);
        overflow:   auto;

        & > * {
            background:     $surface-card;
            max-width:      600px;
            padding:        $spacing $spacing $spacing * 4;
            margin:         $spacing auto 0;
            border-radius:  $radius-lg $radius-lg 0 0;
            box-shadow:     $shadow-md;
        }
    }

    & > .big-content {
        background:     linear-gradient($surface-header, $surface-header 120px, $surface-page 121px);
        padding-bottom: $spacing * 4;
        overflow:       auto;

        & > * {
            @include page-width;
            background:     $surface-card;
            padding:        $spacing $spacing $spacing * 4;
            margin-top:     $spacing;
            border-radius:  $radius-lg $radius-lg 0 0;
            box-shadow:     $shadow-md;

            @media (max-width: #{$page-width-max-width}) {
                margin-top: 0;
            }
        }
    }
}

.error-enter-active, .error-leave-active {
    transition: all $dur-normal $ease-standard;
}

.error-enter-from, .error-leave-to {
    opacity:   0;
    transform: scale(.8);
}

a {
    color:                   $accent;
    text-decoration-color:   rgba($orange, 0.35);
    text-underline-offset:   2px;

    &:hover {
        text-decoration-color: $accent;
    }

    &:visited {
        color: $accent;
    }
}

table.standard {
    border-collapse: collapse;

    tr {
        border-bottom: 1px solid $hairline;
    }

    thead th {
        padding:        12px 4px;
        border-bottom:  2px solid $primary;
        color:          $ink;
        font-size:      $fs-xs;
        text-transform: uppercase;
        letter-spacing: $tracking-wide;
    }

    td {
        padding: 4px;
    }

    tr:nth-child(even) {
        background: $gray;
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
            border-bottom: 1px solid $hairline;
        }

        td {
            position:     relative;
            text-align:   left;
            padding-left: 40%;
            white-space:  nowrap;

            &::before {
                color:        $ink-muted;
                width:        calc(40% - #{$spacing-medium});
                position:     absolute;
                left:         0;
                padding-left: $spacing-small;
            }
        }
    }
}

@mixin button {
    display: inline-flex; align-items: center; justify-content: center; gap: $space-2;
    @include tap-target;
    padding: 10px 18px;
    font-family: $font-text; font-weight: $fw-semibold; font-size: $fs-base; line-height: 1;
    background: $accent; color: $accent-ink;
    border: 1px solid transparent; border-radius: $radius-sm; text-decoration: none;
    cursor: pointer;
    transition: background $dur-fast $ease-standard, box-shadow $dur-fast $ease-standard, transform $dur-instant $ease-standard;

    &:hover  { background: $accent-hover; }
    &:active { background: $accent-pressed; transform: translateY(1px); }
    &:focus-visible { @include focus-ring; }
    &:disabled { background: $accent; opacity: 0.4; cursor: not-allowed; transform: none; }

    @media (prefers-reduced-motion: reduce) {
        transition: background $dur-fast linear;
        &:active { transform: none; }
    }
}

a.button {
    display: inline-flex;
    @include button;
}

button:not(.icon) {
    @include button;

    &.secondary {
        background: transparent;
        color:      $accent;
        border:     1px solid rgba($orange, 0.4);

        &:hover {
            background: rgba($orange, 0.08);
        }
    }

    &.destructive {
        background: $destructive;

        &:hover {
            background: $mnp-red-600;
        }
    }
}

button.icon {
    @include tap-target;
    display:    inline-flex;
    align-items: center;
    justify-content: center;
    border:     none;
    padding:    0;
    background: transparent;
    cursor:     pointer;

    path {
        fill: $accent;
    }

    &:hover path {
        fill: $accent-hover;
    }

    &:active path {
        fill: $accent-pressed;
    }

    &:focus-visible {
        @include focus-ring;
    }

    &:disabled, &:disabled:active {
        opacity: 0.2;
        cursor:  not-allowed;

        & path {
            fill: $accent;
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
        font-size:           $fs-base;
        font-family:         $font-text;
        border:              1px solid $hairline;
        border-radius:       $radius-sm;
        background-color:    $surface-card;
        background-image:    url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCBtZWV0IiB2aWV3Qm94PSIwIDAgNDAwIDMwMCIgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiPjxkZWZzPjxwYXRoIGQ9Ik0yMDAgMjk5LjE2TDQwMCAwTDAgMEwyMDAgMjk5LjE2WiIgaWQ9ImRzOUpFd3NLIj48L3BhdGg+PC9kZWZzPjxnPjxnPjxnPjx1c2UgeGxpbms6aHJlZj0iI2RzOUpFd3NLIiBvcGFjaXR5PSIxIiBmaWxsPSIjY2NjY2NjIiBmaWxsLW9wYWNpdHk9IjEiPjwvdXNlPjwvZz48L2c+PC9nPjwvc3ZnPg==');
        background-repeat:   no-repeat;
        background-position: right .7em center;
        background-size:     .65em;
        color:               $ink;

        &::-ms-expand {
            display: none;
        }

        &:focus {
            border-color: $primary;
            box-shadow:   0 0 0 3px rgba($primary, 0.15);
        }
    }

    input[type="text"], input[type="password"], input[type="number"] {
        -webkit-appearance: none;
        -moz-appearance:    none;
        appearance:         none;

        border:             1px solid $hairline;
        border-radius:      $radius-sm;
        background:         $surface-card;
        color:              $ink;
        font-family:        $font-text;
        font-size:          $fs-base;
        padding:            14px;
        width:              100%;

        &::placeholder {
            color: $ink-faint;
        }

        &:focus {
            border-color: $primary;
            box-shadow:   0 0 0 3px rgba($primary, 0.15);
        }
    }
}

div.buttons {
    display:         flex;
    gap:             $spacing-medium;
    justify-content: center;
    flex-wrap:       wrap;
}

p.note {
    color:     $ink-muted;
    font-size: $fs-sm;
}
</style>
