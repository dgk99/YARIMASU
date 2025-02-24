<script setup>

import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 이메일과 이름을 저장할 변수 생성
const email = ref('');
const name = ref('');

// 이메일 찾기 함수
const find_password = () => {
    if (name.value.trim() !== '' && email.value.trim() !== ''){

        // LocalStorage에서 기존 회원 데이터 가져오기
        const existingUser = JSON.parse(localStorage.getItem("users")) || [];
        
        // 가져온 정보에서 이름과 전화번호가 맞나 확인
        const isNameAndEmail = existingUser.find(user => user.name === name.value && user.email === email.value);

        // 이름과 전화번호가 맞으면, 관련된 이메일을 팝업으로 제공
        if (isNameAndEmail){
            alert(`회원님의 비밀번호는: ${isNameAndEmail.password} 입니다.`);
            router.push('/');
        } else {
            // 맞지 않으면, 경고 팝업 후 재입력 요구
            alert('이름 혹은 이메일이 존재하지 않습니다. 다시 입력해주세요.')
            return;
        }
    } else {
        alert('이름과 이메일 모두 입력해주세요.')
    }
};

// 취소 함수 (취소 버튼을 누르면 로그인 화면으로 이동)
const back_to_main = () => {
    router.push('/')
}


</script>

<template>
    <h2>비밀번호 찾기</h2>

    <!--이메일 입력 폼-->
    <label for="email">이메일: </label>
    <input type="text" v-model="email" placeholder="이메일을 입력해 주세요" required>
    <br>
    <br>

    <!--이름 입력 폼-->
    <label for="name">이름: </label>
    <input type="text" v-model="name" placeholder="이름을 입력해 주세요" required>
    <br>
    <br>

    <!--이메일 찾기 및 취소 버튼-->
    <button @click="find_password">비밀번호 찾기</button>
    <button @click="back_to_main">취소</button>
    

</template>