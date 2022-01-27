/*
 * @Author: 贺永胜
 * @Date: 2022-01-23 17:23:34
 * @email: 1378431028@qq.com
 * @LastEditors: 贺永胜
 * @LastEditTime: 2022-01-27 18:40:42
 * @Descripttion: 
 */
class AudioObj {
  // static status = false
  constructor() {
    this.status = false
    this.backMusic = new Audio();
    this.playInterval = null
  }
  playAudio (src) {
    if (this.status) {
      const audio = new Audio()
      audio.src = src
      audio.load()
      audio.volume = .5
      audio.play()
    }
  }
  backMusicPlay (src) {
    if (this.status) {
      if (src) {
        this.backMusic.src = src
        this.backMusic.load()
      }
      this.backMusic.volume = 0
      this.backMusic.play()
      this.playInterval = setInterval(() => {
        if (this.backMusic.volume < 1) {
          this.backMusic.volume = (this.backMusic.volume + 0.1).toFixed(1)
        } else {
          clearInterval(this.playInterval)
        }
      }, 100)
    }
  }
  backMusicStop () {
    this.playInterval = setInterval(() => {
      if (this.backMusic.volume > 0) {
        this.backMusic.volume = (this.backMusic.volume - 0.1).toFixed(1)
      } else {
        clearInterval(this.playInterval)
        this.backMusic.pause()
      }
    }, 100)
  }
}
export default new AudioObj();