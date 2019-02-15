import Vue from "vue";
import App from "./App.vue";
import "./plugins/axios";
import router from "./router";
// import store from "./store";
import {
  Button,
  Icon,
  Form,
  TextField,
  Checkbox
} from 'muse-ui';
import 'muse-ui/lib/styles/base.less';
import 'muse-ui/lib/styles/theme.less';
import "muse-ui-message/dist/muse-ui-message.css";
import "@/scss/init.scss";
import Toast from "muse-ui-toast";
import "babel-polyfill";
Vue.config.productionTip = false;
Vue.use(Button);
Vue.use(Icon);
Vue.use(Form);
Vue.use(TextField);
Vue.use(Checkbox);
Vue.use(Toast,{
  position: "top",
  time: 2000,
  color: "#000",
  textColor: "red"
});
new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
