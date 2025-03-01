<template>
  <div class="register-container">
    <h2>회원가입</h2>
    <form @submit.prevent="handleRegister">
      <input type="email" v-model="email" placeholder="이메일" required />
      <input type="password" v-model="password" placeholder="비밀번호" required />
      <input type="password" v-model="confirmPassword" placeholder="비밀번호 확인" required />
      <input type="text" v-model="name" placeholder="이름" required />
      <input type="date" v-model="birthdate" required />
      <input type="number" v-model="height" placeholder="키(cm)" required />

      <div>
        <label><input type="radio" v-model="gender" value="남성" required /> 남성</label>
        <label><input type="radio" v-model="gender" value="여성" required /> 여성</label>
      </div>

      <input type="file" @change="handleFileUpload" required />

      <button type="submit">회원가입</button>
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
      confirmPassword: "",
      name: "",
      birthdate: "",
      height: "",
      gender: "",
      firstPhoto: null,
    };
  },
  methods: {
    handleFileUpload(event) {
      this.firstPhoto = event.target.files[0];
    },
    async handleRegister() {
      if (this.password !== this.confirmPassword) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }

      const formData = new FormData();
      formData.append("email", this.email);
      formData.append("password", this.password);
      formData.append("name", this.name);
      formData.append("birthdate", this.birthdate);
      formData.append("height", this.height);
      formData.append("gender", this.gender);
      if (this.firstPhoto) {
        formData.append("firstPhoto", this.firstPhoto);  // ✅ 백엔드 필드명과 일치해야 함
      }


      try {
        await axios.post("http://210.101.236.158:5000/api/register", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("회원가입 성공!");
        this.$router.push("/login");
      } catch (error) {
        alert("회원가입 실패!");
      }
    },
  },
};
</script>

<style scoped>
.register-container {
  width: 350px;
  margin: auto;
  text-align: center;
}
input {
  width: 100%;
  padding: 8px;
  margin: 5px 0;
}
button {
  width: 100%;
  padding: 10px;
  background-color: green;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
