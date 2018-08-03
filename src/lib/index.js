import vueBaberrage from './vue-baberrage.vue'
vueBaberrage.install = (Vue, options) => {
    Vue.component(vueBaberrage.name, vueBaberrage)
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(vueBaberrage)
}

export default vueBaberrage
