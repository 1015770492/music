import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import lbui from 'lb-vue-ui'
import 'lb-vue-ui/Lb-vueUi.css' // 引入组件样式
Vue.use(lbui)
Vue.use(ElementUI);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
