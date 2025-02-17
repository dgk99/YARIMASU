<script setup>
import { ref } from 'vue';

const isVisible = ref(true) // 화면에 보일지 여부를 저장하는 변수
</script>

<template>
    <button @click="isVisible = !isVisible">토글</button>

    <p v-if="isVisible">이 문장은 보입니다.</p>
    <p v-else>이 문장은 숨겨졌습니다.</p>
</template>