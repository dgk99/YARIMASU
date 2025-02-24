<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const phone_num = ref('');

const password = ref('');

// 로그인 확인을 위한 mock data
const mockUsers = [
    { phone: '1', password: '1'}, { phone: '2', password: '2'}];

// 사용자가 아이디와 비밀번호를 모두 입력하고 로그인 버튼을 누르면 
// 데이터베이스에서 검사하고 존재하는 사용자면 로그인 화면으로
// 존재하지 않으면 존재하지 않는 유저입니다 라고 팝업 창 생성
const login_check = () => {
    if (phone_num.value.trim() !== '' && password.value.trim() !== '') {
        const login_result = mockUsers.find(u => u.phone === phone_num.value && u.password === password.value);
        if (login_result) {
            router.push('/UserPage');
        } else {
            // 로그인 실패 팝업 후 입력 값 초기화
            alert('존재하지 않는 유저입니다.');
            phone_num.value = '';
            password.value = '';
        }
    }
}


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
         <label type="text" for="phone_num">전화번호: </label>
        <input v-model="phone_num" placeholder="전화번호를 입력해주세요" />
        <br />
        <br />
        <!-- 비밀번호 입력 폼 -->
        <label type="password" for="password">비밀번호: </label>
        <input v-model="password" placeholder="비밀번호를 입력해주세요" />
        <br />
        <br />
        <!-- 로그인, 회원가입 버튼 -->
        <button @click="login_check">로그인</button>
        <button @click="signup">회원가입</button> 
        <!-- 비밀번호 찾기 작게 버튼 -->
    </div>
</template>