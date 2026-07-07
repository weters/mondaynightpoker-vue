<template>
    <div class="welcome">
        <div class="hero">
            <div class="hero-overlay"></div>
            <div class="text">
                <p class="slug">Dealer's Choice Poker Night</p>

                <p>Your weekly card game, anywhere in the world.</p>

                <p>Play classic dealer's choice games with friends&mdash;no downloads, no fees, just poker.</p>

                <p class="sign-up">
                    <router-link to="/signup" class="button hero-button">Get Started</router-link>
                </p>
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
        min-height:      475px;
        position:        relative;
        overflow:        auto;

        .hero-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.1) 100%);
            pointer-events: none;
        }

        .text {
            $width: 450px;

            @include card;
            box-shadow: $shadow-lg;
            padding: $spacing * 1.5;
            max-width: $width;
            position: absolute;
            left: 50%;
            top: 45%;
            transform: translateY(-50%);
            margin: 0 $spacing 0 0;
            z-index: 1;

            p {
                line-height: 1.6;
                color: $text-color;
            }

            p.slug {
                font-size: 1.4em;
                font-weight: bold;
                color: $primary;
                margin-bottom: $spacing;
            }

            @media(max-width: calc(600px + 2 * #{$spacing})) {
                left: auto;
                right: $spacing;
                margin: 0 0 0 $spacing;
            }

            p.sign-up {
                margin: $spacing-medium 0 0 0;
                text-align: right;
            }

            .hero-button {
                box-shadow: $shadow-md;
                transition: transform $transition-fast, box-shadow $transition-fast;

                &:hover {
                    transform: translateY(-2px);
                    box-shadow: $shadow-hover;
                }
            }
        }
    }

    .games {
        @include page-width;
        margin-top: $spacing * 1.5;
        padding-bottom: $spacing * 1.5;

        .intro-card {
            @include card;
            padding: $spacing;
            margin-bottom: $spacing * 1.5;

            p {
                margin: 0;
                line-height: 1.7;
                color: $text-color;

                a {
                    color: $primary;
                    text-decoration: none;
                    font-weight: 500;

                    &:hover {
                        color: $orange;
                        text-decoration: underline;
                    }
                }
            }
        }

        h2 {
            color: $text-color;
            margin-bottom: $spacing;
            position: relative;
            display: inline-block;

            &::after {
                content: '';
                position: absolute;
                bottom: -4px;
                left: 0;
                width: 60px;
                height: 3px;
                background: $orange;
                border-radius: 2px;
            }
        }

        .game-list {
            list-style: none;
            margin: $spacing 0 0 0;
            padding: 0;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            grid-gap: $spacing;

            @media (max-width: 399px) {
                display: block;

                .game {
                    margin-bottom: $spacing;
                }
            }

            .game {
                @include card;
                @include card-hover;
                padding: $spacing;
                position: relative;

                .badge {
                    display: inline-block;
                    font-size: 0.65rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    padding: 4px 8px;
                    border-radius: $border-radius-small;
                    margin-bottom: $spacing-medium;
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
                    color: $light-green;
                }

                .badge-survival {
                    background: rgba(251, 192, 45, 0.15);
                    color: #b38600;
                }

                .badge-guts {
                    background: rgba(229, 57, 53, 0.1);
                    color: $red;
                }

                h3 {
                    margin: 0 0 $spacing-medium 0;
                    color: $primary;
                    font-size: 1.15em;
                }

                p {
                    margin: 0;
                    line-height: 1.65;
                    color: $text-color;
                    font-size: 0.95em;
                }
            }
        }
    }
}
</style>