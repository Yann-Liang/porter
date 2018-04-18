//js
import Vue from 'vue'
import router from './router'
import store from './vuex/store'

//css
import '../static/css/reset.css'

//less
import "./less/index.less"

if (typeof window.kLine === "undefined") {
  window.kLine = {
    btmeth: {},
    eosusdt: {},
    ethusdt: {},
    btcusdt: {},
    bchusdt: {},

  };
};

if (!process.env.IS_WEB){
    Vue.use(require('vue-electron'));
}
//Vue.config.silent = true;
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
});
