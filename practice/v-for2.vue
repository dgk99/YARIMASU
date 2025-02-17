<script setup>
import {ref} from 'vue'

const fruits = ref(['사과', '바나나', '포도']) // 과일 목록 배열
const newFruit = ref('') // 새로 추가할 과일 이름

const addFruit = () => {
    if (newFruit.value.trim() !== ''){
        fruits.value.push(newFruit.value) // 배열에 새로운 과일 추가
        newFruit.value = '' // 입력창 초기화
    }
}
</script>

<template>
    <h2>과일 목록</h2>
    <ul>
        <li v-for="(fruit, index) in fruits" :key="index">
            {{ index + 1 }}. {{ fruit }}
        </li>
    </ul>

    <input v-model="newFruit" placeholder="추가할 과일 입력" />
    <button @click="addFruit">추가</button>
</template>