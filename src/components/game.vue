<!--
 * @Author: 贺永胜
 * @Date: 2022-01-17 22:06:02
 * @email: 1378431028@qq.com
 * @LastEditors: 贺永胜
 * @LastEditTime: 2022-01-18 00:04:01
 * @Descripttion: 
-->
<template>
  <div class='game-wrap' @click="tangyuanUpEmit" @keyup.space="tangyuanUpEmit" autofocus tabindex="0">
    <!-- 汤圆 -->
    <div class="tangyuan" ref="tangyuan"></div>
    <!-- 柱子 -->

  </div>
</template>

<script>

export default {
  name: '',
  data() {
    return {
      // 汤圆部分
      tangyuanG: 0.02, // 设定的重力加速度
      tangyuanUpStartTime: 0, // 汤圆开始上抛的时间
      tangyuanDownStartTime: 0, // 汤圆开始下坠的时间
      tangyuanUpV: 5, // 汤圆上抛的初速度
      tangyuanUpInterval: null, // 汤圆上抛的定时器
      tangyuanDownInterval: null, // 汤圆下坠的定时器

      // 柱子部分
      
    }
  },
  mounted () {
    // this.tangyuanStartDown()
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
    }
    
  },
}
</script>
<style scoped>
.game-wrap {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
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
</style>