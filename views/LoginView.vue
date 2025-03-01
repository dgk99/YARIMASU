<template>
  <div>
    <h2>로그인</h2>
    <form @submit.prevent="handleLogin">
      <input type="email" v-model="email" placeholder="이메일 입력" required />
      <input type="password" v-model="password" placeholder="비밀번호 입력" required />
      <button type="submit">로그인</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post("http://210.101.236.158:5000/api/login", {
          email: this.email,
          password: this.password,
        });

        localStorage.setItem("token", response.data.token);
        alert("로그인 성공!");
        this.$router.push("/mypage");
      } catch (error) {
        alert("로그인 실패!");
      }
    },
  },
};
</script>
