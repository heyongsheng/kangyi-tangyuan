<!--
 * @Author: 贺永胜
 * @Date: 2022-01-14 23:17:44
 * @email: 1378431028@qq.com
 * @LastEditors: 贺永胜
 * @LastEditTime: 2022-01-14 23:26:01
 * @Descripttion: 
-->
<template>
  <div id="app">
    <bg></bg>
  </div>
</template>

<script>
import bg from '@/components/bg.vue'

export default {
  name: 'App',
  components: {
    bg
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
