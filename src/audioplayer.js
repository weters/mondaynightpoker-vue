class AudioPlayer {
    constructor() {
        this.audio = new Audio()
        this.dingTimeout = null

        const listener = () => {
            this.audio.src = '@/assets/ding.mp3'
            this.audio.play()
            this.audio.pause()
            this.audio.currentTime = 0
            document.removeEventListener('touchstart', listener)
        }

        document.addEventListener('touchstart', listener)
    }

    queueDing() {
        if (this.dingTimeout) {
            clearTimeout(this.dingTimeout)
        }

        this.dingTimeout = setTimeout(() => {
            this.audio.src = require('@/assets/ding.mp3')
            this.audio.play()
            this.dingTimeout = null
        }, 5000)
    }

    cancelDing() {
        if (this.dingTimeout) {
            clearTimeout(this.dingTimeout)
            this.dingTimeout = null
        }
    }
}

export default new AudioPlayer()