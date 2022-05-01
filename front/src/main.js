import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import vuelidate from "./plugins/vuelidate";
import moment from "./plugins/moment";
import { errorHandler } from "./utils";

Vue.config.productionTip = false;
Vue.config.errorHandler = errorHandler;

new Vue({
  moment,
  router,
  store,
  vuetify,
  vuelidate,
  render: (h) => h(App),
}).$mount("#app");
