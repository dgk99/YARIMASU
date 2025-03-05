import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/components/views/LoginView.vue";
import RegisterView from "@/components/views/RegisterView.vue";
import MyPage from "@/components/views/MyPage.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: LoginView },
  { path: "/register", component: RegisterView },
  { path: "/mypage", component: MyPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
