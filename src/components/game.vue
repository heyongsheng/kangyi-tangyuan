<!--
 * @Author: 贺永胜
 * @Date: 2022-01-17 22:06:02
 * @email: 1378431028@qq.com
 * @LastEditors: 贺永胜
 * @LastEditTime: 2022-01-20 23:49:55
 * @Descripttion: 
-->
<template>
  <div class='game-wrap' @click="tangyuanUpEmit" @keyup.space="tangyuanUpEmit" autofocus tabindex="0">
    <!-- 柱子 -->
    <div class="pillar-wrap" ref="pillarWrap"></div>
    <!-- 汤圆 -->
    <div class="tangyuan" ref="tangyuan"></div>
  </div>
</template>

<script>

export default {
  name: '',
  data() {
    return {
      screenWidth: document.documentElement.clientWidth, // 屏幕宽度
      screenHeight: document.documentElement.clientHeight, // 屏幕高度

      // 汤圆部分
      tangyuanG: 0.02, // 设定的重力加速度
      tangyuanUpStartTime: 0, // 汤圆开始上抛的时间
      tangyuanDownStartTime: 0, // 汤圆开始下坠的时间
      tangyuanUpV: 5, // 汤圆上抛的初速度
      tangyuanUpInterval: null, // 汤圆上抛的定时器
      tangyuanDownInterval: null, // 汤圆下坠的定时器

      // 柱子部分
      createPillarInterval: null, // 创建柱子的定时器
      createPillarLastTime: '', // 上一次创建柱子的时间
      pillarFrequency: 4000, // 柱子生成的频率 毫秒/次
      pillarWidth: 100, // 柱子的宽度
      pillarGapHeight: 200, // 柱子的间距
      pillarMoveInterVal: null, // 柱子移动的定时器
      pillarSpeed: 2, // 柱子移动的速度
    }
  },
  mounted () {
    // this.tangyuanStartDown()
    this.createPillar()
    this.movePillar()
  },
  methods: {
    /**
     * @description: 汤圆上抛触发器
     * @param {*}
     * @return {*}
     */
    tangyuanUpEmit () {
      this.tangyuanStartUp()
    },
    /**
     * @description: 汤圆开始上抛
     * @param {*}
     * @return {*}
     */    
    tangyuanStartUp() {
      // 上抛时清除正在上抛或下坠的定时器
      cancelAnimationFrame(this.tangyuanDownInterval)
      cancelAnimationFrame(this.tangyuanUpInterval)
      this.tangyuanUpStartTime = Date.now()
      this.tangyuanDownStartTime = 0
      this.tangyuanUping()
    },
    /**
     * @description: 汤圆上抛中
     * @param {*}
     * @return {*}
     */
    tangyuanUping() {
      let now = Date.now()
      let t = now - this.tangyuanUpStartTime
      let v0 = this.tangyuanUpV
      let g = this.tangyuanG
      let y = v0 - g * t
      this.$refs.tangyuan.style.top = this.$refs.tangyuan.offsetTop - y + 'px'
      if (y < 0) {
        this.tangyuanStartDown()
      } else {
        this.tangyuanUpInterval = requestAnimationFrame(this.tangyuanUping)
      }
    }, 
    // 汤圆开始下落
    tangyuanStartDown() {
      this.tangyuanStartTime = Date.now();
      this.tangyuanDown()
    },
    /**
     * @description: 汤圆下坠中
     * @param {*}
     * @return {*}
     */    
    tangyuanDown () {
      let now = Date.now()
      let t = now - this.tangyuanStartTime
      let g = this.tangyuanG
      let y = g * t
      console.log(now -  this.tangyuanStartTime);
      this.$refs.tangyuan.style.top = this.$refs.tangyuan.offsetTop + y  + 'px';
      this.tangyuanDownInterval = requestAnimationFrame(this.tangyuanDown)
    },
    /**
     * @description: 开始生成柱子
     * @param {*}
     * @return {*}
     */
    createPillar () {
      // 根据上跟柱子的生成时间和设定的生成频率生成柱子
      let now = new Date().getTime()
      if (now - this.createPillarLastTime > this.pillarFrequency) {
        // 需要先根据屏幕高度算出柱子的空隙区间范围
        // 此处暂时设定为一格的可用范围为屏幕高度的十分之一
        let screenSpan = this.screenHeight / 10
        // 设定间隙区间范围为屏幕中间的四格，那么间隙顶部的坐标范围就是屏幕的十分之三到（十分之七-间隙高度）之间
        let gapTop = Math.floor(Math.random() * (screenSpan * 7 - this.pillarGapHeight))  + screenSpan * 3
        let gapBottom = gapTop + this.pillarGapHeight

        // 根据间隙区间范围生成柱子
        this.createPillarDom(0, this.screenHeight-gapTop, 'pillar-item-top')
        this.createPillarDom(gapBottom, 0, 'pillar-item-bottom')
        this.createPillarLastTime = now
      }
      this.createPillarInterval = requestAnimationFrame(this.createPillar)
    },
    /**
     * @description: 柱子生成器
     * @param {*}
     * @return {*}
     */    
    createPillarDom (top, bottom, className) {
      let pillar = document.createElement('div')
      pillar.className = className
      pillar.style.left = this.screenWidth + 'px'
      pillar.style.top = top + 'px'
      pillar.style.bottom = bottom + 'px'
      pillar.style.width = this.pillarWidth + 'px'
      this.$refs.pillarWrap.appendChild(pillar)
    },
    /**
     * @description: 整体柱子移动
     * @param {*}
     * @return {*}
     */
    movePillar() {
      // 获取所有柱子
      let pillarDoms = this.$refs.pillarWrap.children
      let pillarList = Array.from(pillarDoms)
      for (let index = 0; index < pillarList.length; index++) {
        let item = pillarList[index]
        if (item.offsetLeft < -this.pillarWidth) {
          this.$refs.pillarWrap.removeChild(item)
        } else {
          item.style.left = item.offsetLeft - this.pillarSpeed + 'px'
        }
      }
      // 获取当前与汤圆最近右侧的柱子
      let left = this.$refs.tangyuan.offsetLeft - this.pillarWidth - this.$refs.tangyuan.offsetWidth / 2
      let nextDomIndex = pillarList.findIndex(item => {
        return item.offsetLeft > left
      })
      let pillarTop = pillarList[nextDomIndex]
      let pillarBottom = pillarList[nextDomIndex+1]
      pillarTop.className = 'pillar-item-active'
      pillarBottom.className = 'pillar-item-active'
      // 获取汤圆的半径及圆心坐标
      let tangyuanRadius = this.$refs.tangyuan.offsetWidth / 2
      let tangyuanCenterX = this.$refs.tangyuan.offsetLeft
      let tangyuanCenterY = this.$refs.tangyuan.offsetTop
      // 检测汤圆与上方柱子是否碰撞
      // 获取上方柱子中心的坐标
      let pillarTopCenterX = pillarTop.offsetLeft + this.pillarWidth / 2
      let pillarTopCenterY = pillarTop.offsetHeight / 2
      console.log(tangyuanCenterX);
      console.log(this.pillarWidth, pillarTop.offsetHeight, tangyuanRadius,tangyuanCenterX-pillarTopCenterX, tangyuanCenterY-pillarTopCenterY);
      if (this.computeCollision(this.pillarWidth, pillarTop.offsetHeight, tangyuanRadius,tangyuanCenterX-pillarTopCenterX, tangyuanCenterY-pillarTopCenterY)) {
        this.gameOver()
        return
      }
      // 检测汤圆与下方柱子是否碰撞
      // 获取下方柱子中心的坐标
      let pillarBottomCenterX = pillarBottom.offsetLeft + this.pillarWidth / 2
      let pillarBottomCenterY = pillarTop.offsetHeight + this.pillarGapHeight + pillarBottom.offsetHeight / 2

      if (this.computeCollision(this.pillarWidth, pillarBottom.offsetHeight, tangyuanRadius,tangyuanCenterX-pillarBottomCenterX, tangyuanCenterY-pillarBottomCenterY)) {
        this.gameOver()
        return
      }

      
      // // 根绝上下柱子获取柱子间隙四个点的坐标
      // let gapTop = pillarTop.offsetHeight
      // let gapBottom = pillarBottom.offsetTop
      // let gapLeft = pillarTop.offsetLeft
      // let gapRight = pillarTop.offsetLeft + pillarTop.offsetWidth
      // console.log(gapTop, gapBottom, gapLeft, gapRight);

      // // 根据汤圆的位置判断是否碰撞
      // if (this.$refs.tangyuan.offsetTop > gapTop && this.$refs.tangyuan.offsetTop < gapBottom) {
      //   if (this.$refs.tangyuan.offsetLeft > gapLeft && this.$refs.tangyuan.offsetLeft < gapRight) {
      //     alert('游戏结束')
      //   }
      // }

      this.pillarMoveInterVal = requestAnimationFrame(this.movePillar)
    },
    /**
     * @description: 圆形与矩形的碰撞检测
     * @param {*} w 矩形的宽
     * @param {*} h 矩形的高
     * @param {*} r 圆形的半径
     * @param {*} rx 圆心与矩形中心的x距离
     * @param {*} ry 圆心与矩形中心的y距离
     * @return {*}
     */    
    computeCollision (w, h, r, rx, ry) {
      var dx = Math.min(rx, w * 0.5);
      var dx1 = Math.max(dx, -w * 0.5);
      var dy = Math.min(ry, h * 0.5);
      var dy1 = Math.max(dy, -h * 0.5);
      return (dx1 - rx) * (dx1 - rx) + (dy1 - ry) * (dy1 - ry) <= r * r;
    },
    /**
     * @description: 游戏结束
     * @param {*}
     * @return {*}
     */
    gameOver () {
      cancelAnimationFrame(this.tangyuanUpInterval)
      cancelAnimationFrame(this.tangyuanDownInterval)
      cancelAnimationFrame(this.createPillarInterval)
      cancelAnimationFrame(this.pillarMoveInterVal)
      alert('游戏结束')
    }
    
  },
}
</script>
<style>
.game-wrap {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
/* 汤圆 */
.tangyuan {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: url('../assets/img/tangyuan.png');
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
/* 柱子 */
.pillar-wrap {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.pillar-item-top {
  position: absolute;
  background-image: linear-gradient(to bottom, #545a5c, #303338);
}
.pillar-item-bottom {
  position: absolute;
  background-image: linear-gradient(to top, #545a5c, #303338);
}
.pillar-item-active {
  position: absolute;
  background-image: linear-gradient(to top, #ffd06c, #ffedc7);
}
</style>