<script setup>
import { useRouter } from 'vue-router';
import ProfileCard from './ProfileCard.vue';

const router = useRouter();

// 로컬 스토리지에서 사용자 정보 불러오기

const logout = () => {
    // 로컬 스토리지에서 사용자의 정보 제거
    localStorage.removeItem("loggedInUser"); // 로그인한 사용자 정보 삭제
    alert('로그아웃 되었습니다.');
    router.push('/'); // 로그인 페이지로 이동
}
</script>

<template>
    <h2>My Page</h2>

    <button @click="logout">로그아웃</button>

    <ProfileCard />

</template>