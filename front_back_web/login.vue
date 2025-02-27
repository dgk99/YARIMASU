<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// 이메일, 비밀번호 변수
const user_email = ref('');
const user_password = ref('');

// 로그인 함수
const login = () => {
    if (user_email.value.trim() !== '' && user_password.value.trim() !== '') {
        // 이메일과 비밀번호를 데이터베이스에서 조회
        // 회원이라면 토큰 생성 후 userpage로 이동

        // 회원이 아니라면 폼 초기화 후 재입력 요구
    }
}
// 회원가입 함수
const register = () => {
    // 회원가입 창으로 이동
    Router.push('/register');
}

// 아이디 찾기 함수

// 비밀번호 찾기 함수

</script>

<template>
    <!--사용자 입력 폼-->
    <div>
        <h1>YARIMASU LOGIN</h1>
        <!--이메일 입력-->
        <label for="email">이메일: </label>
        <input type="email" v-model="user_email" placeholder="이메일을 입력해주세요" required><br><br>
        <!--비밀번호 입력-->
        <label for="password">비밀번호: </label>
        <input type="password" v-model="user_password" placeholder="비밀번호를 입력해주세요" required><br><br>

        <!--로그인, 회원가입 버튼-->
        <button @click="login">로그인</button>
        <button @click="register">회원가입</button><br><br>

        <div class="link-container">
            <router-link to="/find-email">이메일 찾기</router-link>
            <router-link to="/find-password">비밀번호 찾기</router-link>
        </div>
    </div>
</template>

<style>
.link-container {
  display: flex;
  justify-content: space-between; /* 좌우 끝으로 배치 */
  width: 100%; /* 부모 요소의 전체 너비 사용 */
  max-width: 300px; /* 필요하면 크기 조절 */
  margin: 0 auto; /* 가운데 정렬 */
}
</style>