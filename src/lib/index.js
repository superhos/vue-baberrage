import vueBaberrage from './vue-baberrage.vue'
import { MESSAGE_TYPE } from './constants'

vueBaberrage.install = (Vue, options) => {
  Vue.component(vueBaberrage.name, vueBaberrage)
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(vueBaberrage)
}

export {
  MESSAGE_TYPE,
  vueBaberrage
}
