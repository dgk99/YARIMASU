<script setup>
import { onMounted, ref } from 'vue';

// 사용자 정보를 저장할 변수
const userData = ref({});
const isEditing = ref(false); // 수정 모드 여부(true: input 폼, false: p 태그)

// 로컬 스토리지에서 사용자 정보 가져오기
onMounted(() => {
    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || null;

    console.log("✅ 저장된 users:", allUsers);
    console.log("✅ 현재 로그인한 사용자:", loggedInUser);

    if (loggedInUser) {
        userData.value = allUsers.find(user => user.email === loggedInUser.email) || {};
    }

    console.log("✅ 최종 userData:", userData.value);
});


// 사용자 정보 수정 함수
const startEdit = () => {
    isEditing.value = true;
}

// 완료 버튼을 누르면 localstorage에 저장 후 p 태그로 변경
const saveChanges = () => {
    localStorage.setItem("users", JSON.stringify(userData.value));
    isEditing.value = false;
};

// 취소 함수 (취소 버튼을 누르면 로그인 화면으로 이동)
const cancelEdit = () => {
    userData.value = JSON.parse(localStorage.getItem("users")) || {};
    isEditing.value = false;
};
</script>

<template>

    <div>
        <h2>사용자 정보</h2>
        <!-- 기존의 사용자 정보 출력 -->
        <div v-if=!isEditing>
            <p>이름: {{ userData.name }}</p>
            <p>생년월일: {{ userData.birth_date }}</p>
            <p>키: {{ userData.height }}</p>
            <p>성별: {{ userData.gender }}</p>
            <button @click="startEdit">수정</button>
        </div>
        <!-- 수정하기 버튼을 누르면 폼 으로 변경 -->
        <div v-else>
            <label>이름: <input v-model="userData.name" /></label><br>
            <label>생년월일: <input type="date" v-model="userData.birth_date" /></label><br>
            <label>키: <input v-model="userData.height" /></label><br>
            <label>성별:
                <select v-model="userData.gender">
                    <option value="남성">남성</option>
                    <option value="여성">여성</option>
                    <option value="Guitar">Guitar</option>
                </select><br>

            </label>

            <button @click="saveChanges">수정 완료</button>
            <button @click="cancelEdit">취소</button>
        </div>
    </div>

</template>