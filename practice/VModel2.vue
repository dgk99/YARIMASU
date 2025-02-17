<script setup>
import {ref} from 'vue'

const inputText = ref('')
const isChecked = ref(false) // 체크박스 상태
const selectedColor = ref('red') // 선택된 색상
</script>

<template>
    <!--텍스트 입력-->
    <input v-model="inputText" placeholder="입력하세요" />
    <p>입력한 값: {{ inputText }}</p>

    <!--체크 박스-->
    <input type="checkbox" v-model="isChecked" />
    <p>체크박스 상태: {{ isChecked }}</p>

    <!--드롭다운-->
    <select v-model="selectedColor">
        <option value="red">빨강</option>
        <option value="blue">파랑</option>
        <option value="green">초록</option>
    </select>
    <p>선택된 색상: {{ selectedColor }}</p>
</template>