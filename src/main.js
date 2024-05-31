import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
import * as echarts from 'echarts';
Vue.config.productionTip = false

Vue.use(ElementUI);

Vue.prototype.$axios = axios;
axios.defaults.baseURL = 'http://192.168.103.174:8080/api/';

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
