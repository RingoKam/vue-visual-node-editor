import Vue from 'vue'
import App from './App.vue'
import VueRx from 'vue-rx'
import GraphNodeV2 from "./components/GraphNodeV2.vue"
import GraphNodeV3 from "./components/GraphNodeV3.vue"
Vue.config.productionTip = false
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';

Vue.use(VueRx)

const myCustomComponents = {
  GraphNodeV2,
  GraphNodeV3,
}

Vue.component('v-select', vSelect)
Vue.component(myCustomComponents)
Vue.component(GraphNodeV3)

new Vue({
  render: h => h(App)
}).$mount('#app')
