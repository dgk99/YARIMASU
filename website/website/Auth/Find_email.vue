<script setup>

import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 전화번호와 이름을 저장할 변수 생성
const phone_num = ref('');
const name = ref('');

// 이메일 찾기 함수
const find_email = () => {
    if (name.value.trim() !== '' && phone_num.value.trim() !== ''){

        // LocalStorage에서 기존 회원 데이터 가져오기
        const existingUser = JSON.parse(localStorage.getItem("users")) || [];
        
        // 가져온 정보에서 이름과 전화번호가 맞나 확인
        const isNameAndPhone = existingUser.find(user => user.name === name.value && user.phone_num === phone_num.value);

        // 이름과 전화번호가 맞으면, 관련된 이메일을 팝업으로 제공
        if (isNameAndPhone){
            alert(`회원님의 이메일은: ${isNameAndPhone.email} 입니다.`);
            router.push('/');
        } else {
            // 맞지 않으면, 경고 팝업 후 재입력 요구
            alert('이름 혹은 전화번호가 존재하지 않습니다. 다시 입력해주세요.')
            return;
        }
    } else {
        alert('이름과 전화번호 모두 입력해주세요.')
    }
};

// 취소 함수 (취소 버튼을 누르면 로그인 화면으로 이동)
const back_to_main = () => {
    router.push('/')
}


</script>

<template>
    <h2>이메일 찾기</h2>

    <!--이름 입력 폼-->
    <label for="name">이름: </label>
    <input type="text" v-model="name" placeholder="이름을 입력해 주세요" required>
    <br>
    <br>

    <!--전화번호 입력 폼-->
    <label for="phone_num">전화번호: </label>
    <input type="text" v-model="phone_num" placeholder="- 없이 전화번호를 입력해 주세요" required>
    <br>
    <br>

    <!--이메일 찾기 및 취소 버튼-->
    <button @click="find_email">이메일 찾기</button>
    <button @click="back_to_main">취소</button>
    

</template>