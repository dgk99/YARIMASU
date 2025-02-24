<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const email = ref('');

const password = ref('');


// 사용자가 아이디와 비밀번호를 모두 입력하고 로그인 버튼을 누르면 
// 데이터베이스에서 검사하고 존재하는 사용자면 로그인 화면으로
// 존재하지 않으면 존재하지 않는 유저입니다 라고 팝업 창 생성
const login_check = () => {
    // 입력 값이 비어있나 확인
    if (email.value.trim() !== '' && password.value.trim() !== ''){
        // 저장된 데이터가 없으면 빈 배열 반환
        const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

        // 입력한 이메일과 비밀번호가 일치하는 사용자 찾기
        const login_result = storedUsers.find(user => user.email === email.value && user.password === password.value);

        if (login_result){
            // 로그인 성공 -> 토큰 생성
            const token = `token_${login_result.id}_${new Date().getTime()}_${Math.random().toString(36).substr(2, 9)}`;

            // 로그인한 사용자 정보 저장 (id, token 포함)
            const loggedInUser = {
                id: login_result.id,
                email: login_result.email,
                name: login_result.name,
                token: token
            };

            localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

            // 사용자 페이지로 이동
            alert("로그인 성공!!")
            router.push('/UserPage');
        } else {
            // 로그인 실패 -> 경고 메시지 & 재입력 요구
            alert('존재하지 않는 유저입니다.');
            email.value = '';
            password.value = '';
        }
    } else {
        alert('이메일과 비밀번호를 입력해주세요.');
    }
};


// 회원가입 버튼을 누르면 회원가입 화면으로 이동
const signup = () => {
    router.push('/Signup');
}


</script>

<template>
    <div>
        <!-- 로그인 글자 -->
        <h1>YARIMASU GYM</h1>
        <h2>로그인</h2>
        <!-- 로그인 시 필요한 전화번호 입력 폼 -->
         <label type="text" for="email">이메일: </label>
        <input v-model="email" placeholder="이메일을 입력해주세요" />
        <br />
        <br />
        <!-- 비밀번호 입력 폼 -->
        <label type="password" for="password">비밀번호: </label>
        <input type="password" v-model="password" placeholder="비밀번호를 입력해주세요" />
        <br />
        <br />
        <!-- 로그인, 회원가입 버튼 -->
        <button @click="login_check">로그인</button>
        <button @click="signup">회원가입</button> 
        <!-- 비밀번호 찾기 작게 버튼 -->
        <br>
        <br>
        <div style="display: flex; justify-content: space-between;">
        <router-link to="/Find_email">이메일 찾기</router-link>
        <router-link to="/Find_pass">비밀번호 찾기</router-link>
        </div>

    </div>
</template>