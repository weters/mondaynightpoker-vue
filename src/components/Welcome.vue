<template>
    <div class="welcome">
        <div class="hero">
            <div class="hero-overlay"></div>
            <div class="text">
                <p class="slug">Online dealer's choice poker</p>

                <p>Can't make it to the poker table? Bring the table to you.</p>

                <p>Monday Night Poker lets you play your favorite dealer's choice card games with your friends online!</p>

                <p class="sign-up">
                    <router-link to="/signup" class="button hero-button">Sign Up</router-link>
                </p>
            </div>
        </div>

        <div class="games">
            <div class="intro-card">
                <p>Monday Night Poker is a free, online site for playing card games with your friends. This project was started by a <a href="https://tompeters.me/">developer</a> who wanted to continue his Monday night tradition of playing card games with his friends. Not only is it 100% free, it's also <a href="https://github.com/weters/mondaynightpoker-server/">open-sourced</a> using the MIT License.</p>
            </div>

            <h2>Dealer's Choice Poker Games</h2>

            <ul class="game-list">
                <li class="game">
                    <h3>Acey Deucey</h3>

                    <p>Two cards are dealt face up. You must bet on the chance that the next card lands in the middle.
                        Be careful, posting will cost you double!</p>
                </li>
                <li class="game">
                    <h3>Bourré</h3>

                    <p>This trick-taking game requires you to play a better card than the previous one. Most tricks take
                        the pot; players without any tricks must match the pot!</p>
                </li>
                <li class="game">
                    <h3>Texas Hold'em</h3>

                    <p>The most popular poker game in the world. You each get two cards dealt face-down and everyone
                    shares five cards on the board. Best five-card hand wins. Also supports Pineapple and Lazy Pineapple variants.</p>
                </li>
                <li class="game">
                    <h3>Little L</h3>

                    <p>Three-card poker with three more community cards making an L shape. Players can use any single
                        card, or any two connected cards. Best three-card hand wins!</p>
                </li>
                <li class="game">
                    <h3>Pass the Poop</h3>

                    <p>Don't get stuck with the low card, or you lose a life. Last player standing wins the pot! There's
                        two additional variants to keep things spicy.</p>
                </li>
                <li class="game">
                    <h3>Seven Card</h3>

                    <p>Two down, four up, one down. Best five-card hand wins. Additional variants for Baseball, Low-Card
                        Wild, and Follow the Queen keeps players on their toes.</p>
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
@import '../variables.scss';

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
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
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

                h3 {
                    margin: 0 0 $spacing-medium 0;
                    color: $primary;
                    font-size: 1.1em;
                }

                p {
                    margin: 0;
                    line-height: 1.6;
                    color: $text-color;
                }
            }
        }
    }
}
</style>