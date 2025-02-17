<script setup>
import {ref} from 'vue' // ref()를 사용하기 위해 가져옴

const message = ref('hellowww vue') // message라는 변수 만들기
</script>

<template>
    <h1>{{ message }}!</h1> <!--message 변수를 화면에 표시-->
</template>