<script setup>
import { useRouter } from 'vue-router';
import ProfileCard from './ProfileCard.vue';
import PhotoList from './PhotoList.vue';

const router = useRouter();

// 로그아웃 기능
const logout = () => {
    localStorage.removeItem("loggedInUser"); // 로그인한 사용자 정보 삭제
    alert('로그아웃 되었습니다.');
    router.push('/'); // 로그인 페이지로 이동
};

</script>

<template>
    <h2>My Page</h2>

    <button @click="logout">로그아웃</button>

    <!-- 사용자 정보 -->
    <ProfileCard />

    <!-- 사진 목록 -->
    <PhotoList />
</template>
