<!--
 * @Author: 贺永胜
 * @Date: 2022-01-17 22:06:02
 * @email: 1378431028@qq.com
 * @LastEditors: 贺永胜
 * @LastEditTime: 2022-01-18 18:47:37
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
      pillarWidth: 50, // 柱子的宽度
      pillarGap: 200, // 柱子的间距
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
      // 需要先根据屏幕高度算出柱子的空隙区间范围
      // 此处暂时设定为一格的可用范围为屏幕高度的十分之一
      let screenSpan = this.screenHeight / 10
      // 设定间隙区间范围为屏幕中间的四格，那么间隙顶部的坐标范围就是屏幕的十分之三到（十分之七-间隙高度）之间
      let gapTop = Math.floor(Math.random() * (screenSpan * 7 - this.pillarGap))  + screenSpan * 3
      let gapBottom = gapTop + this.pillarGap

      // 根据间隙区间范围生成柱子
      this.createPillarDom(0, this.screenHeight-gapTop)
      this.createPillarDom(gapBottom, 0)
    },
    /**
     * @description: 柱子生成器
     * @param {*}
     * @return {*}
     */    
    createPillarDom (top, bottom) {
      let pillar = document.createElement('div')
      pillar.className = 'pillar-item'
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
        item.style.left = item.offsetLeft - this.pillarSpeed + 'px'
      }
      this.pillarMoveInterVal = requestAnimationFrame(this.movePillar)
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
.pillar-item {
  position: absolute;
  background: rgb(38, 42, 54);
}
</style>