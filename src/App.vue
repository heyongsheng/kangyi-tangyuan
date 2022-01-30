<!--
 * @Author: 贺永胜
 * @Date: 2022-01-14 23:17:44
 * @email: 1378431028@qq.com
 * @LastEditors: 贺永胜
 * @LastEditTime: 2022-01-30 13:41:50
 * @Descripttion: 
-->
<template>
  <div id="app">
    <!-- 建议打开声音遮罩 -->
    <transition name="fade">
      <div class="audio-mask" v-show="audioMask" @click="audioMask = false">
        <div class="audio-mask-container">
          <p class="audio-mask-text">打开声音可使游戏体验大大提高，强烈建议您打开声音</p>
          <div class="mask-btn-wrap">
            <div class="mask-btn" @click="openAudio">打开</div>
            <div class="mask-btn">算了</div>
          </div>
        </div>
      </div>
    </transition>
    <!-- 背景 -->
    <bg></bg>
    <!-- 菜单 -->
    <transition name="fade">
      <div class="menu-wrap" v-show="gameStatus === 'menu'">
        <div class="game-title"><span class="letter">抗疫的汤</span>圆</div>
        <div class="menu-box">
          <div
            class="menu-item"
            v-for="(item, index) in menuList"
            :key="index"
            @mouseover="$audio.playAudio(hoverMusic)"
            @click="$audio.playAudio(clickMusic), item.clickHandle()"
            v-show="item.show()"
          >
            {{ item.name }}
          </div>
        </div>
      </div>
    </transition>
    <!-- 游戏区 -->
    <transition name="fade">
      <game @goHome="gameStatus = 'menu'" v-show="gameStatus === 'start'" ref="game"></game>
    </transition>
  </div>
</template>

<script>
import bg from '@/components/bg.vue'
import game from '@/components/game'
export default {
  name: 'App',
  components: {
    bg,
    game
  },
  mounted () {
  },
  data () {
    return {
      audioMask: true, // 是否打开声音遮罩
      hoverMusic: require('./assets/audio/hover.mp3'),
      clickMusic: require('./assets/audio/click.mp3'),
      windMusic: require('./assets/audio/wind.mp3'),
      gameStatus: 'menu', // 游戏状态，menu：菜单，start：游戏，over：结束
      menuList: [
        {
          name: '自由模式',
          clickHandle: () => {
            this.gameStatus = 'start'
            this.$nextTick(() => {
              this.$refs.game.gameStart('free')
            })
          },
          show: () => true
        },
        {
          name: '故事模式',
          clickHandle: () => {
            this.gameStatus = 'start'
            this.$nextTick(() => {
              this.$refs.game.gameStart('story')
            })
          },
          show: () => true
        },
        {
          name: '打开声音',
          clickHandle: () => {
            this.$audio.status = true
            this.$audio.backMusicPlay(this.windMusic)
            this.$forceUpdate()
          },
          show: () => !this.$audio.status
        },
        {
          name: '关闭声音',
          clickHandle: () => {
            this.$audio.status = false
            this.$forceUpdate()
          },
          show: () => this.$audio.status
        },
        {
          name: '前往主页',
          clickHandle: () => {
            window.open('https://ihope_top.gitee.io/my-site/')
          },
          show: () => true
        },
      ]
    }
  },
  watch: {
    gameStatus (val) {
      if (val === 'menu') {
        this.$audio.backMusicPlay(this.windMusic)
      }
    }
  },
  methods: {
    openAudio () {
      this.$audio.status = true
      this.$audio.backMusicPlay(this.windMusic)
      // this.$forceUpdate()
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  user-select: none;
  font-family: PingFangSC-Regular, Microsoft Yahei, sans-serif;
}
#app {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
}
/* 声音建议遮罩 */
.audio-mask {
  position: fixed;
  top: 0;
  left: -300px;
  right: -300px;
  bottom: 0;
  background: rgba(0, 0, 0, 1);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32px;
  color: #fff;
  text-shadow: 0 0 5px #fff;
  pointer-events: none;
}
.audio-mask-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  max-width: 35%;
  min-width: 300px;
}
.mask-btn-wrap {
  margin-top: 50px;
  width: 100%;
  display: flex;
  pointer-events: auto;
  justify-content: space-around;
}
.mask-btn {
  cursor: pointer;
}
/* 菜单区 */
.menu-wrap {
  position: absolute;
  z-index: 20;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  pointer-events: none;
}
.game-title {
  position: absolute;
  font-size: 86px;
  white-space: nowrap;
  color: #fff;
  text-shadow: 0 0 10px #fff;
  top: 10vh;
  left: 50%;
  transform: translate(-50%, -50%);
}
.letter {
  letter-spacing: 50px;
}
.menu-box {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 26px;
  letter-spacing: 5px;
  color: #fff;
  text-shadow: 0 0 5px #fff;
  pointer-events: auto;
}
.menu-item {
  opacity: 0.8;
  cursor: pointer;
  transition: all 0.4s;
}
.menu-item:hover {
  opacity: 1;
}
.menu-item:not(:first-child) {
  margin-top: 30px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 1s, transform 1s;
}
.fade-enter /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateX(200px)
}
.fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateX(-200px)
}

/* 提示语样式 */
.alert-text {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%);
  font-size: 32px;
  opacity: 1;
  color: #fff;
  text-shadow: 0 0 5px #fff;
  transition: all 1s;
  text-align: center;
}

@media screen and (max-width: 768px) {
  .game-title {
    font-size: 42px;
  }
  .game-title .letter {
    letter-spacing: 10px;
  }
}
</style>
