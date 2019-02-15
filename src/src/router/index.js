import Vue from "vue";
import Router from "vue-router";
const test = () => import( /* webpackChunkName: "Index" */ "@/pages/test");
Vue.use(Router);
export default new Router({
  mode: "hash",
  base: "/",
  routes: [
    {
      path: "/",
      name: "HelloWorld",
      component: test
    }
  ]
});
