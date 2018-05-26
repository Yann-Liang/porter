//js
import Vue from 'vue'
import router from './router'
import store from './vuex/store'
import Huobipro from '@/exchange/huobipro';

//css
import '../static/css/reset.css'

//less
// import "./less/index.less"
window.kLine={}

if (!process.env.IS_WEB){
    Vue.use(require('vue-electron'));
}
//Vue.config.silent = true;
Vue.config.productionTip = false

window.$huobipro = new Huobipro();

new Vue({
  el: '#app',
  router,
  store,
});

