import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import App from './App.vue'
import router from './router'
import store from './store'
import Axios from 'axios'
import Console from './console'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(Vuetify)

Axios.defaults.baseURL = process.env.NODE_ENV === 'production' ? 'http://zha-ita021-w10:8080' : 'http://localhost:9999'
Axios.defaults.withCredentials = true
Axios.interceptors.response.use(function (response) {
  Console.push(response)
  return response
}, function (error) {
  return Promise.reject(error)
})

Vue.prototype.$http = Axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
