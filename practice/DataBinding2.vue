<script setup>
import {ref} from 'vue'

const message = ref('HELLO VUE!!') // 처음에는 HELLO VUE 값을 저장

const changeMessage = () => {
    message.value = '안녕, vue!' // 버튼을 클릭하면 새로운 값으로 변경
}
</script>

<template>
    <h1>{{ message }}</h1> <!--현재 message 값이 표시됨-->
    <button @click="changeMessage">문구 변경</button> <!--버튼 클릭 시 실행-->
</template>