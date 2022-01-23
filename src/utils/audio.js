/*
 * @Author: 贺永胜
 * @Date: 2022-01-23 17:23:34
 * @email: 1378431028@qq.com
 * @LastEditors: 贺永胜
 * @LastEditTime: 2022-01-23 17:31:12
 * @Descripttion: 
 */
class Audio {
  constructor() {
    this.backMusic = new Audio();
  }
  playAudio (state, src) {
    if (state.setting.isPlay) {
      const audio = new Audio()
      audio.src = src
      audio.load()
      audio.volume = .5
      audio.play()
    }
  }
}
export default Audio;