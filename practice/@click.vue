<script setup>
import {ref} from 'vue'

const count = ref(0) // 숫자를 저장할 변수

const increase = () => {
    count.value++ // 버튼을 누를 때 마다 count 값이 증가
}
</script>

<template>
    <p>클릭 횟수: {{ count }}</p>
    <button @click="increase">클릭!</button>
</template>