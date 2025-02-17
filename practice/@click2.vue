<script setup>
import {ref} from 'vue'

const inputText = ref('') // 사용자가 입력한 값을 저장

const resetText = () => {
    inputText.value = '' // 버튼을 클릭하면 입력값을 빈 문자열로 변경
}
</script>

<template>
    <input v-model="inputText" placeholder="입력하세요" />
    <p>입력한 값: {{ inputText }}</p>

    <button @click="resetText">초기화</button> <!--클릭하면 resetText() 실행-->
</template>