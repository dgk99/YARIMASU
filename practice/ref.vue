<script setup>
import { ref } from 'vue'; // Vue에서 ref()를 가져옴

const message = ref('Hello, Vue!') // 반응형 변수 생성
</script>

<template>
    <h1>{{ message }}</h1> <!--message 값을 화면에 표시-->
    <button @click="message = '안녕, Vue!'">변경</button>
</template>