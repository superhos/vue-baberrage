import vueBaberrage from './vue-baberrage.vue'
const baberrage = {
  install (Vue, options) {
    Vue.component(vueBaberrage.name, vueBaberrage)
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(baberrage)
}

export default baberrage
