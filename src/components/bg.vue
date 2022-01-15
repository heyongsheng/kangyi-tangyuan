<!--
 * @Author: 贺永胜
 * @Date: 2022-01-14 21:01:42
 * @email: 1378431028@qq.com
 * @LastEditors: 贺永胜
 * @LastEditTime: 2022-01-15 10:22:01
 * @Descripttion: 
-->
<template>
  <div class='bg-wrap'>
    <!-- 背景上半部分 -->
    <div class='bg-top' ref="bgTop">
      <!-- <img class="bg-city" src="../assets/img/bg.png"> -->
    </div>
    <!-- 背景下半部分 -->
    <div class='bg-bottom'>
    </div>
    <!-- 下雪 -->
    <div class="snow-wrap" ref="snowWrap"></div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      screenWidth: document.documentElement.clientWidth, // 屏幕宽度
      screenHeight: document.documentElement.clientHeight, // 屏幕高度
      citySpeed: 1, // 背景移动速度
    }
  },
  mounted () {
    console.log(this.$refs.bgTop.$el);
    this.createCity()
    this.snowStart()
  },
  methods: {
    /**
     * @description: 生成城市背景
     * @param {*} index
     * @return {*}
     */
    createCity (index) {
      let city = document.createElement('img')
      // let bulletHeight = document.documentElement.clientHeight / 10
      city.className = 'bg-city'
      city.style.left = this.screenWidth + 'px'
      city.src = require('../assets/img/bg.png')
      city.createNext = false // 是否已创建下一个背景
      this.$refs.bgTop.appendChild(city)

      // 弹幕移动
      let cityMove = () => {
        city.style.left = city.offsetLeft - this.citySpeed + 'px'
        // 判断是否加载下一个背景
        if (!city.createNext) {
          // 如果本条城市背景距离屏幕右侧为0，则加载下一个背景
          if (city.offsetLeft < (this.screenWidth - city.offsetWidth)) {
            this.createCity(index)
            city.createNext = true
          }
        }

        // 如果城市背景距离右侧距离大于等于屏幕宽度，则移除此城市背景
        if (city.offsetLeft < (-city.offsetWidth)) {
          this.$refs.bgTop.removeChild(city)
        } else {
          requestAnimationFrame(cityMove)
        }
      }
      cityMove()
    },
    /**
     * @description: 下雪
     * @param {*}
     * @return {*}
     */
    snowStart () {
      // 创建雪花
      let snowItem = document.createElement('div')
      snowItem.className = 'snow-item'
      

      this.$refs.snowWrap.appendChild(snowItem)
    }
  },
}
</script>
<style>
.bg-wrap {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.bg-top {
  height: 80%;
  position: relative;
  background-image: linear-gradient(to bottom, #59666c, #5a5f62);
}
.bg-city {
  display: block;
  position: absolute;
  bottom: 0;
  width: 1209px;
  height: 93px;
  opacity: 0.1;
}
.bg-bottom {
  height: 20%;
  background-image: linear-gradient(to bottom, #545a5c, #303338);
}
/* 雪花样式 */
.snow-wrap {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.snow-item {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, .7);
  border-radius: 50%;
  box-shadow: 0 0 5px 2px rgba(255, 255, 255, 1);
}
</style>