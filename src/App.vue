<!--
 * @Author: 贺永胜
 * @Date: 2022-01-14 23:17:44
 * @email: 1378431028@qq.com
 * @LastEditors: 贺永胜
 * @LastEditTime: 2022-01-23 17:48:25
 * @Descripttion: 
-->
<template>
  <div id="app">
    <!-- 背景 -->
    <bg></bg>
    <!-- 游戏区 -->
    <game></game>
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
  data () {
    return {
      gameStatus: 'start', // 游戏状态，start：开始，pause：暂停，over：结束
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
</style>
