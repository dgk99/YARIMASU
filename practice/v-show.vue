<script setup>
import { ref } from 'vue'

const isVisible = ref(true) // 화면에 보일지 여부를 저장하는 변수
</script>

<template>
    <button @click="isVisible = !isVisible">토글</button>
    <p v-show="isVisible">이 문장은 v-show로 제어됩니다.</p>
</template>