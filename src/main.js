/*
 * @Author: 贺永胜
 * @Date: 2022-01-16 16:57:02
 * @email: 1378431028@qq.com
 * @LastEditors: 贺永胜
 * @LastEditTime: 2022-01-23 17:32:27
 * @Descripttion: 
 */
import Vue from 'vue'
import App from './App.vue'
import audio from './utils/audio'

Vue.config.productionTip = false
Vue.prototype.$audio = audio

new Vue({
  render: h => h(App),
}).$mount('#app')
