import '@babel/polyfill';
// Import Component hooks before component definitions
import './component-hooks';
import Vue from 'vue';
import './plugins/vuetify';
import './plugins/vee-validate';
import App from './App.vue';
import router from './router';
import store from '@/store';
import './registerServiceWorker';
import vuetify from '@/plugins/vuetify';
import 'vuetify/dist/vuetify.min.css';
import VueScrollProgressBar from '@guillaumebriday/vue-scroll-progress-bar';

Vue.use(VueScrollProgressBar);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
