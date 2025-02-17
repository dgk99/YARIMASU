<script setup>
import {ref} from 'vue'

const fruits = ref(['apple', 'banana', 'grape', 'pear', 'tomato']) // 과일 목록 배열
</script>

<template>
    <h2>과일 목록</h2>
    <ul>
        <li v-for="(fruit, index) in fruits" :key="index">
            {{ index + 1 }}. {{ fruit }}
        </li>
    </ul>
</template>