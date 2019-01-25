import Vue from 'vue'
import App from './App.vue'
import { vueBaberrage } from './lib/index.js'

Vue.use(vueBaberrage)

let vm = new Vue({
  el: '#app',
  render: h => h(App)
})

Vue.use({
  vm
})
