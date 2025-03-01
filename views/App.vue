<template>
  <div>
    <nav>
      <router-link to="/login">로그인</router-link>
      <router-link to="/register">회원가입</router-link>
      <router-link v-if="token" to="/mypage">마이페이지</router-link>
      <button v-if="token" @click="logout">로그아웃</button>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      token: localStorage.getItem("token"),
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      this.token = null;
      this.$router.push("/login");
    },
  },
};
</script>

<style>
nav {
  display: flex;
  gap: 10px;
  background: #333;
  padding: 10px;
}
nav a {
  color: white;
  text-decoration: none;
}
</style>
