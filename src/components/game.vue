<!--
 * @Author: 贺永胜
 * @Date: 2022-01-17 22:06:02
 * @email: 1378431028@qq.com
 * @LastEditors: 贺永胜
 * @LastEditTime: 2022-01-25 00:57:08
 * @Descripttion: 
-->
<template>
  <div
    class="game-wrap"
    ref="gameWrap"
    @click="tangyuanUpEmit"
    @keyup.space="tangyuanUpEmit"
    autofocus
    tabindex="0"
  >
  <span>{{energy}}</span>
    <div class="energy-wrap" ref="energyWrap"></div>
    <div
      class="energy-fixed energy-item"
      v-show="energy"
      :style="{
        transform: `translate(-50%, 50px) scale(${1 + (energy - 1) / 2})`,
      }"
    ></div>
    <!-- 柱子 -->
    <div class="pillar-wrap" ref="pillarWrap"></div>
    <!-- 汤圆 -->
    <div class="tangyuan" ref="tangyuan"></div>
    <!-- 游戏失败 -->
    <transition name="fade">
      <div class="fail-wrap" v-show="gameStatus === 'fail'">
        <img class="fail-img" src="../assets/img/comeon.png">
        <div class="fail-btn-wrap">
          <div class="fail-btn" @click="gameStatus = '', $emit('goHome')">返回菜单</div>
          <div class="fail-btn" @click.stop="stageChange(stage, true)">再来一次</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>

export default {
  name: '',
  data () {
    return {
      starMusic: require('../assets/audio/star.mp3'),
      reunionMusic: require('../assets/audio/reunion.mp3'),

      // 游戏状态
      gameStatus: 'start',

      // 游戏模式
      mode: '', // story 故事模式 free 自由模式

      // 故事模式特有属性
      stage: 0, // 阶段
      stageOneEnergyCount: 5, // 故事模式下阶段一的能量数
      lifeValue: 0, // 故事模式下阶段二的生命值
      stageTwoEnergyCount: 10, // 故事模式下阶段二的能量数

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
      pillarCount: 0, // 已生成柱子的数量
      createPillarInterval: null, // 创建柱子的定时器
      createPillarLastTime: '', // 上一次创建柱子的时间
      pillarFrequency: 4000, // 柱子生成的频率 毫秒/次
      pillarWidth: 100, // 柱子的宽度
      pillarGapHeight: 220, // 柱子的间距
      pillarMoveInterVal: null, // 柱子移动的定时器
      pillarSpeed: 2, // 柱子移动的速度

      // 能量
      energy: 0, // 当前能量
    }
  },
  mounted () {
    // this.tangyuanStartDown()
    // this.gameStart('story')
  },
  methods: {
    /**
     * @description: 开始游戏
     * @param {*}
     * @return {*}
     */  
    gameStart (mode) {
      this.gameStatus = 'start'
      this.$refs.gameWrap.focus()
      this.mode = mode
      if (mode === 'story') {
        this.stageChange(1)
        this.movePillar()
      } else {
        this.createPillar()
        this.movePillar()
      }
    },

    /**
     * @description: 故事模式下游戏阶段变化
     * @param {*} stage
     * @param {*} isRestart 是否重新开始
     * @return {*}
     */    
    stageChange (stage, isRestart = false) {
      // 重置状态
      if (isRestart) {
        // 清空所有柱子
        this.$refs.pillarWrap.innerHTML = ''
        // 柱子开始移动
        this.movePillar()
        this.gameStatus = 'start'
        this.$refs.tangyuan.style.left= '50%'
        this.$refs.tangyuan.style.top= '50%'
      }
      this.stage = stage
      if (stage === 1) {
        // 重置状态
        this.energy = 0
        this.pillarCount = 0
        this.$audio.backMusicPlay(this.starMusic)
        let _createPillar = () => {
          this.createPillar()
          if (this.pillarCount < this.stageOneEnergyCount) {
            this.createPillarInterval = requestAnimationFrame(_createPillar)
          }
        }
        _createPillar()
      }
      if (stage === 2) {
        this.lifeValue = 3
        this.pillarCount = this.stageOneEnergyCount
        this.$audio.backMusicPlay(this.reunionMusic)
        this.$audio.backMusic.currentTime = 114

        let _createPillar = () => {
          this.createPillar()
          if (this.pillarCount < this.stageOneEnergyCount) {
            this.createPillarInterval = requestAnimationFrame(_createPillar)
          }
        }
        _createPillar()
      }
    },
    /**
     * @description: 汤圆上抛触发器
     * @param {*}
     * @return {*}
     */
    tangyuanUpEmit () {
      console.log(5);
      if (this.gameStatus === 'start') {
        this.tangyuanStartUp()
      }
      // this.tangyuanStartUp()
    },
    /**
     * @description: 汤圆开始上抛
     * @param {*}
     * @return {*}
     */
    tangyuanStartUp () {
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
    tangyuanUping () {
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
    tangyuanStartDown () {
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
      this.$refs.tangyuan.style.top = this.$refs.tangyuan.offsetTop + y + 'px';
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
        let gapTop = Math.floor(Math.random() * (screenSpan * 7 - this.pillarGapHeight)) + screenSpan * 3
        let gapBottom = gapTop + this.pillarGapHeight

        // 根据间隙区间范围生成柱子
        this.createPillarDom(0, this.screenHeight - gapTop, 'pillar-item-top')
        this.createPillarDom(gapBottom, 0, 'pillar-item-bottom')
        this.createPillarLastTime = now
        this.pillarCount++
      }
    },
    /**
     * @description: 柱子生成器
     * @param {*}
     * @return {*}
     */
    createPillarDom (top, bottom, className) {
      let pillar = document.createElement('div')
      // pillar.className = className
      pillar.className = ['pillar-item', className].join(' ')
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
    movePillar () {
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
      // 获取当前与汤圆最近左侧的柱子添加净化效果
      let leftOne = this.$refs.tangyuan.offsetLeft
      let pillartListReverse = [...pillarList].reverse()
      let prevDomIndex = pillartListReverse.findIndex(item => {
        return (item.offsetLeft + item.offsetWidth) < leftOne - this.$refs.tangyuan.offsetWidth / 2
      })
      if (prevDomIndex > -1) {
        // 因为此处把数组反转了，所以prevDomIndex+1是上面那个
        let prevTop = pillartListReverse[prevDomIndex + 1]
        let prevBottom = pillartListReverse[prevDomIndex]
        if (!prevTop.isClear) {
          // 给柱子添加净化效果
          prevTop.classList.add('pillar-item-active')
          prevBottom.classList.add('pillar-item-active')
          // 从柱子间隙处生成能量飞往能量池
          // 获取柱子间隙中心
          let gapCenterX = prevTop.offsetLeft + this.pillarWidth / 2
          let gapCenterY = prevTop.offsetHeight + this.pillarGapHeight / 2
          // 生成能量
          this.createEnergy(gapCenterX, gapCenterY)

          prevTop.isClear = true
        }
      }
      // 获取当前与汤圆最近右侧的柱子，作为碰撞检测的对象
      let leftTwo = this.$refs.tangyuan.offsetLeft - this.pillarWidth - this.$refs.tangyuan.offsetWidth / 2
      let nextDomIndex = pillarList.findIndex(item => {
        return item.offsetLeft > leftTwo
      })
      if (nextDomIndex > -1) {
        let pillarTop = pillarList[nextDomIndex]
        let pillarBottom = pillarList[nextDomIndex + 1]

        // 获取汤圆的半径及圆心坐标
        let tangyuanRadius = this.$refs.tangyuan.offsetWidth / 2
        let tangyuanCenterX = this.$refs.tangyuan.offsetLeft
        let tangyuanCenterY = this.$refs.tangyuan.offsetTop
        // 检测汤圆与上方柱子是否碰撞
        // 获取上方柱子中心的坐标
        let pillarTopCenterX = pillarTop.offsetLeft + this.pillarWidth / 2
        let pillarTopCenterY = pillarTop.offsetHeight / 2
        if (this.computeCollision(this.pillarWidth, pillarTop.offsetHeight, tangyuanRadius, tangyuanCenterX - pillarTopCenterX, tangyuanCenterY - pillarTopCenterY)) {
          this.gameFail()
          return
        }
        // 检测汤圆与下方柱子是否碰撞
        // 获取下方柱子中心的坐标
        let pillarBottomCenterX = pillarBottom.offsetLeft + this.pillarWidth / 2
        let pillarBottomCenterY = pillarTop.offsetHeight + this.pillarGapHeight + pillarBottom.offsetHeight / 2

        if (this.computeCollision(this.pillarWidth, pillarBottom.offsetHeight, tangyuanRadius, tangyuanCenterX - pillarBottomCenterX, tangyuanCenterY - pillarBottomCenterY)) {
          this.gameFail()
          return
        }
      }
      this.pillarMoveInterVal = requestAnimationFrame(this.movePillar)
    },
    /**
     * @description: 生成能量
     * @param {*} x x轴坐标
     * @param {*} y y轴坐标
     * @return {*}
     */
    createEnergy (x, y) {
      let energyItem = document.createElement('div')
      energyItem.className = 'energy-item'
      energyItem.style.left = x + 'px'
      energyItem.style.top = y + 'px'
      setTimeout(() => {
        energyItem.style.left = 50 + '%'
        energyItem.style.top = 50 + 'px'
        setTimeout(() => {
          this.energy++
          if(this.energy === this.stageOneEnergyCount && this.mode === 'story') {
            this.$audio.backMusicStop()
            setTimeout(() => {
              this.stageChange(2)
            }, 2000)
          }
        }, 1000)
      }, 300)
      this.$refs.energyWrap.appendChild(energyItem)
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
     * @description: 失败
     * @param {*}
     * @return {*}
     */    
    gameFail () {
      this.gameStatus = 'fail'
      cancelAnimationFrame(this.tangyuanUpInterval)
      cancelAnimationFrame(this.tangyuanDownInterval)
      cancelAnimationFrame(this.createPillarInterval)
      cancelAnimationFrame(this.pillarMoveInterVal)
      this.$audio.backMusicStop()
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
      this.$audio.backMusicStop()
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
.pillar-item {
  position: absolute;
  transition: background-color 1s;
}
.pillar-item-top {
  background: rgb(48, 48, 48)
    linear-gradient(to top, rgba(255, 241, 113, 0), rgba(255, 253, 223, 0.5));
}
.pillar-item-bottom {
  background: rgb(48, 48, 48)
    linear-gradient(to bottom, rgba(255, 241, 113, 0), rgba(255, 253, 223, 0.5));
}
.pillar-item-active {
  background-color: #ffdb8f;
  /* background-image: linear-gradient(to top, #ffd06c, #ffedc7); */
}
/* 能量 */
.energy-item {
  position: fixed;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #98ff6e;
  box-shadow: 0 0 2px 2px #98ff6e;
  transition: all 1s;
}
.energy-fixed {
  left: 50%;
  top: 0;
  z-index: 10;
}

/* 游戏失败弹窗 */
.fail-wrap {
  position: absolute;
  top: 0;
  bottom: 0;
  left: -300px;
  right: -300px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background: #5a6165;
  z-index: 12;
}
.fail-img {
  width: 30%;
  max-width: 357px;
}
.fail-btn-wrap {
  margin-top: 10vh;
  width: 30%;
  max-width: 357px;
  font-size: 26px;
  color: #fff;
  text-shadow: 0 0 5px #fff;
  display: flex;
  justify-content: space-between;
}
.fail-btn {
  cursor: pointer;
  opacity: .8;
  transition: all .3s;
}
.fail-btn:hover {
  opacity: 1;
}
</style>