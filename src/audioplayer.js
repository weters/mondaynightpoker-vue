import dingSound from '@/assets/ding.mp3'
import postSound from '@/assets/post.mp3'

class AudioPlayer {
    constructor() {
        this.audio = new Audio()
        this.dingTimeout = null
        this.muted = localStorage.getItem('mute-sounds') === 'true'

        if (!this.muted) {
            const listener = () => {
                this.audio.src = dingSound
                this.audio.play()
                this.audio.pause()
                this.audio.currentTime = 0
                document.removeEventListener('touchstart', listener)
            }

            document.addEventListener('touchstart', listener)
        }
    }

    setMuted(muted) {
        this.muted = muted
        localStorage.setItem('mute-sounds', muted ? 'true' : 'false')
    }

    queueDing() {
        if (this.muted) return

        if (this.dingTimeout) {
            clearTimeout(this.dingTimeout)
        }

        this.dingTimeout = setTimeout(() => {
            this.audio.src = dingSound
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

    playPost() {
        if (this.muted) return

        this.audio.src = postSound
        this.audio.play()
    }
}

export default new AudioPlayer()