/*
 * @Author: 贺永胜
 * @Date: 2022-01-27 00:00:53
 * @email: 1378431028@qq.com
 * @LastEditors: 贺永胜
 * @LastEditTime: 2022-01-27 01:01:31
 * @Descripttion: 提示语组件
 */
class Alert {
  constructor () {
    this.messageList = []
  }
  showText (text, time = 2000) {
    if (this.messageList.length > 0) {
      this.messageList.push({
        text,
        time
      })
      return
    }
    this.showTextHandle(text, time)
    this.messageList.push({
      text,
      time
    })
  }
  showTextHandle (text, time) {
    let dom = document.createElement('p')
    dom.innerText = text
    dom.style.opacity = 0
    dom.style.top = '30%'
    dom.className = 'alert-text'
    document.body.appendChild(dom)
    setTimeout(() => {
      dom.style.opacity = 1
      dom.style.top = '20%'
      setTimeout(() => {
        dom.style.opacity = 0
        dom.style.top = '10%'
        this.messageList.splice(0, 1)
        if (this.messageList.length > 0) {
          this.showTextHandle(this.messageList[0].text, this.messageList[0].time)
        }
        setTimeout(() => {
          dom.remove()
        }, 1000)
      }, time)
    }, 16)
  }
}

export default new Alert()