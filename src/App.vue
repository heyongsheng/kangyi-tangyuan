<!--
 * @Author: 贺永胜
 * @Date: 2022-01-14 23:17:44
 * @email: 1378431028@qq.com
 * @LastEditors: 贺永胜
 * @LastEditTime: 2022-01-17 22:06:53
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
