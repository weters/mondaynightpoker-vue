<template>
  <div class="welcome">
    <div class="hero">
      <div class="hero-overlay" />
      <div class="hero-content">
        <p class="eyebrow">
          Dealer's Choice Poker Night
        </p>

        <h1 class="headline">
          Your weekly poker night, anywhere in the world.
        </h1>

        <p class="subhead">
          Play classic dealer's choice games with friends&mdash;no downloads, no fees, just poker.
        </p>

        <router-link
          to="/signup"
          class="button hero-button"
        >
          Get Started
        </router-link>
      </div>
    </div>

    <div class="games">
      <div class="intro-card">
        <p>Monday Night Poker is a free platform for playing card games with friends online. Built by a <a href="https://tompeters.me/">developer</a> who wanted to keep his weekly poker tradition alive, it's 100% free and <a href="https://github.com/weters/mondaynightpoker-server/">open source</a> under the MIT License.</p>
      </div>

      <h2>Seven Games, Endless Variety</h2>

      <ul class="game-list">
        <li class="game">
          <span class="badge badge-betting">Betting</span>
          <h3>Acey Deucey</h3>
          <p>Two cards are dealt face-up. Bet on whether the third card falls between them&mdash;or hit the post and pay double. Choose from Standard, Continuous Shoe, or Chaos modes.</p>
        </li>
        <li class="game">
          <span class="badge badge-tricks">Tricks</span>
          <h3>Bourré</h3>
          <p>A Cajun trick-taking classic. Win the most tricks to claim the pot, but go trickless and you'll match it. Supports standard 4-suit and wild 5-suit decks.</p>
        </li>
        <li class="game">
          <span class="badge badge-guts">High Stakes</span>
          <h3>Guts</h3>
          <p>Declare "in" or "out" simultaneously&mdash;stay in and you'd better have the best hand, or pay the pot. Play 2-card, 3-card, Bloody Guts, or with trade-ins.</p>
        </li>
        <li class="game">
          <span class="badge badge-community">Community</span>
          <h3>Little L</h3>
          <p>Three-card poker meets community cards arranged in an L shape. Use any single card or two connected cards to build your best three-card hand.</p>
        </li>
        <li class="game">
          <span class="badge badge-survival">Survival</span>
          <h3>Pass the Poop</h3>
          <p>Don't get stuck with the lowest card or lose a life. Pass unwanted cards to your neighbor&mdash;unless they block you. Standard, Diarrhea, and Pairs editions.</p>
        </li>
        <li class="game">
          <span class="badge badge-stud">Stud</span>
          <h3>Seven-Card Stud</h3>
          <p>The classic: two down, four up, one down. Seven variants including Baseball, Low-Card Wild, Follow the Queen, High-Chicago, Chiggs, and Coupons &amp; Clippings.</p>
        </li>
        <li class="game">
          <span class="badge badge-community">Community</span>
          <h3>Texas Hold'em</h3>
          <p>The world's most popular poker game. Two hole cards, five community cards, best five-card hand wins. Includes Pineapple and Lazy Pineapple variants.</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
    name: "Welcome",
    title: 'Monday Night Poker',
}
</script>

<style lang="scss" scoped>
.welcome {
    .hero {
        background:      url(../assets/poker_smoke.jpeg) center;
        background-size: cover;
        position:        relative;
        display:         flex;
        align-items:     center;
        min-height:      420px;
        padding:         $space-8 $space-5;

        @media (min-width: #{$bp-phone}) {
            min-height: 560px;
            padding:    $space-10 $space-6;
        }

        .hero-overlay {
            position: absolute;
            inset:    0;
            // felt-tinted scrim so the hero reads as part of the brand, not a stock photo
            background:
                linear-gradient(160deg, rgba($mnp-felt-900, 0.55) 0%, rgba($mnp-ink-900, 0.8) 55%, rgba($mnp-felt-900, 0.92) 100%);
            pointer-events: none;
        }

        .hero-content {
            position:   relative;
            z-index:    1;
            max-width:  640px;
            margin:     0 auto;
            width:      100%;
        }

        .eyebrow {
            font-family:    $font-text;
            font-size:      $fs-xs;
            font-weight:    $fw-semibold;
            text-transform: uppercase;
            letter-spacing: $tracking-caps;
            color:          $gold-soft;
            text-shadow:    0 1px 8px rgba(#000, 0.4);
            margin-bottom:  $space-3;
        }

        .headline {
            font-family:   $font-display;
            font-size:     clamp(#{$fs-2xl}, 5vw + 1rem, #{$fs-3xl});
            font-weight:   $fw-bold;
            line-height:   $lh-tight;
            letter-spacing: $tracking-tight;
            color:         #fff;
            text-shadow:   0 2px 16px rgba(#000, 0.4);
            margin-bottom: $space-4;
        }

        .subhead {
            font-size:     $fs-md;
            line-height:   $lh-loose;
            color:         $on-felt-muted;
            text-shadow:   0 1px 8px rgba(#000, 0.4);
            max-width:     42em;
            margin-bottom: $space-6;
        }

        .hero-button {
            padding:    13px 28px;
            font-size:  $fs-md;
            box-shadow: $shadow-md;
            transition: transform $dur-fast $ease-standard, box-shadow $dur-fast $ease-standard;

            &:hover {
                transform:  translateY(-2px);
                box-shadow: $shadow-hover;
            }

            @media (prefers-reduced-motion: reduce) {
                transition: box-shadow $dur-fast linear;
                &:hover { transform: none; }
            }
        }
    }

    .games {
        @include page-width;
        margin-top:     $space-6;
        padding-bottom: $space-6;

        .intro-card {
            @include card;
            padding:       $space-5;
            margin-bottom: $space-6;

            p {
                margin:      0;
                line-height: $lh-loose;
                color:       $ink;

                a {
                    color:           $primary;
                    text-decoration: none;
                    font-weight:     $fw-medium;

                    &:hover {
                        color:           $accent;
                        text-decoration: underline;
                    }
                }
            }
        }

        h2 {
            color:         $ink;
            margin-bottom: $space-5;
            position:      relative;
            display:       inline-block;

            &::after {
                content:       '';
                position:      absolute;
                bottom:        -4px;
                left:          0;
                width:         60px;
                height:        3px;
                background:    $accent;
                border-radius: $radius-xs;
            }
        }

        .game-list {
            list-style: none;
            margin:     $space-5 0 0 0;
            padding:    0;
            display:    grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            grid-gap:   $space-5;

            @media (max-width: 399px) {
                display: block;

                .game {
                    margin-bottom: $space-5;
                }
            }

            .game {
                @include card;
                @include card-hover;
                padding:  $space-5;
                position: relative;

                .badge {
                    display:        inline-block;
                    font-size:      $fs-2xs;
                    font-weight:    $fw-semibold;
                    text-transform: uppercase;
                    letter-spacing: $tracking-wide;
                    padding:        4px 8px;
                    border-radius:  $radius-sm;
                    margin-bottom:  $space-3;
                }

                .badge-community {
                    background: rgba(15, 76, 89, 0.1);
                    color: $primary;
                }

                .badge-stud {
                    background: rgba(1, 31, 38, 0.1);
                    color: $secondary;
                }

                .badge-tricks {
                    background: rgba(242, 110, 80, 0.1);
                    color: $orange;
                }

                .badge-betting {
                    background: rgba(76, 175, 80, 0.1);
                    color:      $light-green;
                }

                .badge-survival {
                    background: rgba(251, 192, 45, 0.15);
                    color:      #b38600;
                }

                .badge-guts {
                    background: rgba(229, 57, 53, 0.1);
                    color:      $negative;
                }

                h3 {
                    margin:    0 0 $space-3 0;
                    color:     $primary;
                    font-size: $fs-md;
                }

                p {
                    margin:      0;
                    line-height: $lh-loose;
                    color:       $ink-muted;
                    font-size:   $fs-sm;
                }
            }
        }
    }
}
</style>