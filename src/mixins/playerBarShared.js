import {mapGetters} from "vuex"
import audioplayer from "@/audioplayer"
import balance from "./balance"

export default {
    mixins: [balance],
    data() {
        return {
            localError: null,
            errorTimeout: null,
            dealMeIn: this.$store.getters.userClientState.active,
            dealMeInLoading: false,
            confirmTerminate: false,
            confirmRestart: false,
            muteSounds: audioplayer.muted,
        }
    },
    computed: {
        ...mapGetters({
            isTableAdmin: 'isTableAdmin',
            canTerminate: 'canTerminate',
            canRestart: 'canRestart',
            userClientState: 'userClientState',
        }),
    },
    watch: {
        muteSounds(newVal) {
            audioplayer.setMuted(newVal)
        },
        isTurn: {
            immediate: true,
            handler(isTurn) {
                if (isTurn) {
                    audioplayer.queueDing()
                } else {
                    audioplayer.cancelDing()
                }
            },
        },
    },
    methods: {
        showError(err) {
            if (this.errorTimeout) {
                clearTimeout(this.errorTimeout)
            }
            this.localError = err
            this.errorTimeout = setTimeout(() => {
                this.localError = null
            }, 2000)
        },
        terminateGame() {
            this.$store.state.webSocket.send('terminateGame')
                .catch(err => this.showError(err))
        },
        toggleDealMeIn(active) {
            if (this.dealMeInLoading) return
            this.dealMeInLoading = true
            this.$store.state.webSocket.send('playerStatus', null, null, {active})
                .catch(err => {
                    this.dealMeIn = !active
                    this.showError(err)
                })
                .finally(() => this.dealMeInLoading = false)
        },
    },
}
