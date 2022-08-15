import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Login from "@/views/auth/Login.vue";
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/:id",
      name: "category",
      component: HomeView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/order",
      name: "order",
      component: () => import("../views/OrderView.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: () => import("../views/Dashboard.vue"),
    },
    {
      path: "/setting",
      name: "setting",
      component: () => import("../views/SettingView.vue"),
    },
    {
      path: "/account",
      name: "account",
      component: () => import("../views/AccountView.vue"),
    },
  ],
});
router.beforeEach(() => {
  // if (to.meta.requiresAuth) {
  //   return {
  //     name: "login",
  //   };
  // }
});

export default router;
