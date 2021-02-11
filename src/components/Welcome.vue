<template>
    <div class="welcome">
        <div class="hero">
            <div class="text">
                <p class="slug">Socially distant poker with your friends</p>

                <p>Do you miss handing out with your friends and slinging cards around?</p>

                <p>Monday Night Poker lets you play your favorite dealer’s choice card games with your friends!</p>

                <p class="sign-up">
                    <router-link to="/signup" class="button">Sign Up</router-link>
                </p>
            </div>
        </div>

        <div class="games">
            <h2>Dealer's Choice Poker Games</h2>

            <ul class="game-list">
                <li class="game">
                    <h3>Acey Deucey</h3>

                    <p>Two cards are dealt face up. You must bet on the chance that the third card falls between the two
                        cards. Be careful, posting will cost you double!</p>
                </li>
                <li class="game">
                    <h3>Bourré</h3>

                    <p>This trick-taking game requires you to play a better card than the previous one. Most tricks take
                        the
                        pot, whereas players without any tricks must match the pot!</p>
                </li>
                <li class="game">
                    <h3>Little L</h3>

                    <p>Three-card poker with three more community cards making an L shape. Players can use any single
                        card,
                        or any two connected cards. Best three-card hand wins!</p>
                </li>
                <li class="game">
                    <h3>Pass the Poop</h3>

                    <p>Don’t get stuck with the low card, or you lose a life. Last player standing wins the pot! There’s
                        two
                        additional variants to keep things spicy.</p>
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

        .text {
            p.slug {
                font-size:   1.2em;
                font-weight: bold;
            }

            $width:           450px;

            background-color: white;
            padding:          $spacing;

            /*
            width:     calc(100% - #{$spacing} * 2);
            position:  static;
            transform: none;
            margin:    $spacing * 2 $spacing;
             */

            max-width:        $width;
            position:         absolute;
            left:             50%;
            top:              45%;
            transform:        translateY(-50%);
            margin:           0 $spacing 0 0;

            @media(max-width: calc(600px + 2 * #{$spacing})) {
                left:   auto;
                right:  $spacing;
                margin: 0 0 0 $spacing;
            }

            p.sign-up {
                margin:     0;
                text-align: right;
            }
        }
    }

    .games {
        @include page-width;
        margin-top: $spacing;

        .game-list {
            list-style:            none;
            margin:                0;
            padding:               0;
            display:               grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            grid-gap:              $spacing;

            @media (max-width: 399px) {
                display: block;
            }
        }
    }
}
</style>