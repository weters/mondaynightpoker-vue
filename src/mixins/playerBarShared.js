import {mapActions, mapState} from "pinia"
import {useRootStore} from "@/store"
import audioplayer from "@/audioplayer"
import balance from "./balance"

export default {
    mixins: [balance],
    data() {
        return {
            localError: null,
            errorTimeout: null,
            // userClientState is null until the first clientState message arrives
            // (e.g. reloading into an active game); guard so data() can't throw.
            dealMeIn: useRootStore().userClientState?.active ?? true,
            dealMeInLoading: false,
            confirmTerminate: false,
            confirmRestart: false,
            muteSounds: audioplayer.muted,
        }
    },
    computed: {
        ...mapState(useRootStore, ['isTableAdmin', 'canTerminate', 'canRestart', 'userClientState']),
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
        ...mapActions(useRootStore, ['webSocketSend']),
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
            this.webSocketSend({action: 'terminateGame'})
                .catch(err => this.showError(err))
        },
        toggleDealMeIn(active) {
            if (this.dealMeInLoading) return
            this.dealMeInLoading = true
            this.webSocketSend({action: 'playerStatus', additionalData: {active}})
                .catch(err => {
                    this.dealMeIn = !active
                    this.showError(err)
                })
                .finally(() => this.dealMeInLoading = false)
        },
    },
}
