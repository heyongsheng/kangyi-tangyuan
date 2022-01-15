<!--
 * @Author: 贺永胜
 * @Date: 2022-01-14 21:01:42
 * @email: 1378431028@qq.com
 * @LastEditors: 贺永胜
 * @LastEditTime: 2022-01-15 18:46:02
 * @Descripttion: 
-->
<template>
  <div class="bg-wrap">
    <!-- 背景上半部分 -->
    <div class="bg-top" ref="bgTop">
      <!-- <img class="bg-city" src="../assets/img/bg.png"> -->
    </div>
    <!-- 背景下半部分 -->
    <div class="bg-bottom"></div>
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
      createSnowInterval: null, // 创建雪花定时器
      snowSpeed: 3, // 雪花下落的速度
      lastSnowTime: '', // 最后一片雪花生成时间
      snowFrequencyRatio: 300, // 雪花频率系数，越大雪花越少
      snowFrequency: 0, // 雪花生成的频率（屏幕越大，雪花越多）
      snowAngle: 30,// 雪花偏移角度（小角度可以模拟出角色再前进的感觉，大角度可以模拟风力强大）
    }
  },
  mounted () {
    console.log(this.$refs.bgTop.$el);
    // 根据雪花频率系数和屏幕宽度计算雪花生成的频率
    this.snowFrequency = Math.floor(this.screenWidth / this.snowFrequencyRatio)
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

      // 城市移动移动
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
      // 雪花生成的频率
      let now = new Date().getTime()
      if (now - this.lastSnowTime > (1000 / this.snowFrequency)) {
        // 创建雪花
        let snowItem = document.createElement('div')
        snowItem.className = 'snow-item'
        snowItem.style.top = -snowItem.offsetWidth + 'px'
        // 在给雪花随机分配横向坐标时，范围应该把雪花的偏移量也算进去，否则屏幕右下角会出现空白
        let _left = (this.screenWidth + Math.tan(this.snowAngle * Math.PI / 180) * this.screenHeight) * Math.random()
        snowItem.style.left = _left + 'px'
        // 增加随机透明度
        snowItem.style.opacity = Math.random()

        this.$refs.snowWrap.appendChild(snowItem)

        // 给雪花一个随机的放大系数，之后运动速度要和这个系数相乘
        snowItem.snowScale = Math.random() * 0.5 + 0.5
        snowItem.style.width = snowItem.offsetWidth * snowItem.snowScale + 'px'
        snowItem.style.height = snowItem.offsetHeight * snowItem.snowScale + 'px'

        // 雪花移动
        let snowMove = () => {
          // 此处的雪花移动速度要和当前雪花的移动系数相乘
          let moveY = this.snowSpeed * snowItem.snowScale
          snowItem.style.top = snowItem.offsetTop + moveY + 'px'

          // 根据设置的雪花偏移角度和纵向移动距离计算雪花的横向移动距离
          let moveX = Math.tan(this.snowAngle * Math.PI / 180) * moveY
          snowItem.style.left = snowItem.offsetLeft - moveX + 'px'


          // 如果雪花距离屏幕顶部距离大于等于屏幕高度，则移除此雪花
          if (snowItem.offsetTop > this.screenHeight) {
            this.$refs.snowWrap.removeChild(snowItem)
          } else {
            requestAnimationFrame(snowMove)
          }
        }

        snowMove()
        this.lastSnowTime = now
      }
      this.createSnowInterval = requestAnimationFrame(this.snowStart)
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
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  box-shadow: -2px 0 5px 2px rgba(255, 255, 255, 1);
}
</style>