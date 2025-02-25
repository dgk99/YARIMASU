<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();


// 전화번호, 비밀번호, 이름, 생년월일, 키, 성별, 첫 사진 입력 받기
const email = ref(''); // 이메일: 문자열
const password = ref(''); // 비밀번호: 문자열
const name = ref(''); // 이름: 문자열
const phone_num = ref(''); // 전화번호: 문자열열
const birth_date = ref(''); // 생년월일: 문자열(type: Date)
const height = ref(null); // 키: 정수형
const gender = ref(''); // 성별 : 문자형(select 사용)
const first_photo = ref(null); // 사진: URL로 LocalStorage에 저장

// 회원 가입 완료 함수
const register_complete = () => {

        // 1️⃣ 모든 입력값이 비어있는지 확인
        if (
        email.value.trim() === "" ||
        password.value.trim() === "" ||
        name.value.trim() === "" ||
        phone_num.value.trim() === "" ||
        birth_date.value.trim() === "" ||
        height.value === null ||
        gender.value.trim() === "" ||
        first_photo.value === null
    ) {
        alert("모든 정보를 입력해주세요!"); // 🚨 필수 입력값이 비어있으면 경고
        return; // 🚨 회원가입 중단
    }

    let existingUsers = JSON.parse(localStorage.getItem("users")) || [];

    if (!Array.isArray(existingUsers)) {
        console.error("users 데이터가 배열이 아닙니다! 강제로 배열로 초기화합니다.");
        existingUsers = [];
    }

    const isEmailExist = existingUsers.find(user => user.email === email.value);
    if (isEmailExist) {
        alert("이미 존재하는 이메일입니다. 다른 이메일을 사용해주세요");
        return;
    }


    // 새 회원 정보 추가 (ID 자동 증가)
    const newUserId = existingUsers.length > 0 ? existingUsers[existingUsers.length - 1].id + 1 : 1;

    const newUser = {
        id: newUserId,
        email: email.value,
        password: password.value,
        name: name.value,
        phone_num: phone_num.value,
        birth_date: birth_date.value,
        height: height.value,
        gender: gender.value,
        first_photo: first_photo.value
    };

    // 🚨 기존 배열에 새로운 사용자 추가
    existingUsers.push(newUser);

    // 🚨 `users`를 배열로 저장
    localStorage.setItem("users", JSON.stringify(existingUsers));

    alert("회원가입 완료! 로그인 페이지로 이동합니다!");
    router.push('/');

}

// 등록된 사진 저장 함수
const handleFileUpload = (event) =>{
    const file = event.target.files[0]; // 사용자가 선택한 파일 가져오기
    if (file) {
        const reader = new FileReader(); // FileReader 객체 생성
        reader.readAsDataURL(file); // 파일을 Base64 형식으로 판단
        reader.onload = () => {
            first_photo.value = reader.result; // 변환된 Base64 데이터 저장
            console.log("선택된 사진 (Base64): ", first_photo.value); // 확인용 로그
        };
    }
};

// 취소 함수 (취소 버튼을 누르면 로그인 화면으로 이동)
const back_to_main = () => {
    router.push('/')
}

</script>

<template>
    <h2>회원가입</h2>

    <!--이메일 입력 폼-->
    <label for="email">이메일: </label>
    <input type="text" v-model="email" placeholder="이메일을 입력해 주세요" required>
    <br>
    <br>

    <!--비밀번호 입력 폼-->
    <label for="password">비밀번호: </label>
    <input type="password" v-model="password" placeholder="비밀번호를 입력해 주세요" required>
    <br>
    <br>

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

    <!--생년월일 입력 폼-->
    <label for="birth_date">생년월일: </label>
    <input type="date" v-model="birth_date" required>
    <br>
    <br>

    <!--키 입력 폼-->
    <label for="height">키(cm): </label>
    <input type="number" v-model="height" placeholder="소숫점 없이 키를 입력해 주세요" required>
    <br>
    <br>

    <!--성별 입력 폼-->
    <label for="gender">성별: </label>
    <select v-model="gender">
        <option value="남성">남성</option>
        <option value="여성">여성</option>
        <option value="Guitar">Guitar</option>
    </select>
    <br>
    <br>

    <!--사진 첨부 폼-->
    <label for="first_photo">사진 등록: </label>
    <input type="file" id="first_photo" @change="handleFileUpload" accept="image/*">
    <br>
    <br>

    <!-- ✅ 선택한 사진 미리보기 -->
    <div v-if="first_photo">
    <p>선택한 사진 미리보기:</p>
    <img :src="first_photo" alt="선택된 사진" style="max-width: 150px;">
    </div>

    <!--회원가입 완료 및 취소 버튼-->
    <button @click="register_complete">회원 가입</button>
    <button @click="back_to_main">취소</button>
    
</template>