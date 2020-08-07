import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'

import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)
import router from './router'
import store from './store'

axios.defaults.baseURL = 'https://axios-f68eb.firebaseio.com/';

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
