<script setup>
import {ref} from 'vue'

const inputText = ref('') // 사용자가 입력한 값을 저장하는 변수
</script>

<template>
    <input v-model="inputText" placeholder="입력하세요" />
    <p>입력한 값: {{ inputText }}</p>
</template>