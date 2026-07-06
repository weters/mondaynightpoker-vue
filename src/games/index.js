import AceyDeucey from '@/components/games/aceydeucey/AceyDeucey.vue'
import Bourre from '@/components/games/bourre/Bourre.vue'
import Guts from '@/components/games/guts/Guts.vue'
import TexasHoldEm from '@/components/games/texasholdem/TexasHoldEm.vue'
import SevenCard from '@/components/games/sevencard/SevenCard.vue'
import LittleL from '@/components/games/littlel/LittleL.vue'
import PassThePoop from '@/components/games/passthepoop/PassThePoop.vue'

import GameSelectorAceyDeucey from '@/components/gameselector/GameSelectorAceyDeucey.vue'
import GameSelectorBourre from '@/components/gameselector/GameSelectorBourre.vue'
import GameSelectorGuts from '@/components/gameselector/GameSelectorGuts.vue'
import GameSelectorTexasHoldEm from '@/components/gameselector/GameSelectorTexasHoldEm.vue'
import GameSelectorSevenCard from '@/components/gameselector/GameSelectorSevenCard.vue'
import GameSelectorLittleL from '@/components/gameselector/GameSelectorLittleL.vue'
import GameSelectorPassThePoop from '@/components/gameselector/GameSelectorPassThePoop.vue'

import aceyDeucey from '@/store/aceyDeucey'
import bourre from '@/store/bourre'
import guts from '@/store/guts'
import texasHoldEm from '@/store/texasHoldEm'
import poker from '@/store/poker'
import passThePoop from '@/store/passThePoop'

// games is the single registry of playable games. Each slug must match the key in
// the backend's gamefactory registry (pkg/room/gamefactory/gamefactory.go); the
// backend's gamefactory test asserts the slugs it serves, and games.spec.js asserts
// this list, so drift on either side fails that side's tests.
//
// Array order determines the game-selector display order.
const games = [
    {slug: 'acey-deucey', label: 'Acey Deucey', component: AceyDeucey, selector: GameSelectorAceyDeucey, store: {name: 'aceyDeucey', module: aceyDeucey}},
    {slug: 'bourre', label: 'Bourré', component: Bourre, selector: GameSelectorBourre, store: {name: 'bourre', module: bourre}},
    {slug: 'guts', label: 'Guts', component: Guts, selector: GameSelectorGuts, store: {name: 'guts', module: guts}},
    {slug: 'texas-hold-em', label: "Texas Hold'em", component: TexasHoldEm, selector: GameSelectorTexasHoldEm, store: {name: 'texasHoldEm', module: texasHoldEm}},
    {slug: 'seven-card', label: 'Seven Card', component: SevenCard, selector: GameSelectorSevenCard, store: {name: 'poker', module: poker}},
    {slug: 'little-l', label: 'Little L', component: LittleL, selector: GameSelectorLittleL, store: {name: 'poker', module: poker}},
    {slug: 'pass-the-poop', label: 'Pass the Poop', component: PassThePoop, selector: GameSelectorPassThePoop, store: {name: 'passThePoop', module: passThePoop}},
]

// componentForSlug returns the game component to render for a server game slug,
// or null when the slug is unknown
export function componentForSlug(slug) {
    return games.find(g => g.slug === slug)?.component ?? null
}

// storeModules returns the Vuex modules required by the registered games, keyed by
// module name. Games may share a module (seven-card and little-l both use poker);
// keying by name registers each module exactly once.
export function storeModules() {
    const modules = {}
    for (const g of games) {
        modules[g.store.name] = g.store.module
    }

    return modules
}

export default games
