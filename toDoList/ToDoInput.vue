<script setup>
import { ref } from 'vue';

// 할 일을 입력하는 컴포넌트
// 사용자가 할 일을 입력하고 추가 버튼을 클릭하면 새로운 할 일을 리스트에 추가

const newTodo = ref(''); // 사용자의 입력값을 저장할 상수

// 추가 버튼을 누르거나 엔터를 누르면 상위 컴포넌트(App.vue)로 데이터를 전달하기 위해 이벤트 발생
const emit = defineEmits(['add-todo']);// 부모 컴포넌트로 데이터를 보낼 이벤트 설정

// 할 일을 추가하는 함수
// 입력값을 상위 컴포넌트로 전달하고, 입력창을 초기화 하는 함수
const addTodo = () => {
    if (newTodo.value.trim() !== ''){ // 입력값이 공백이 아니면 실행
        emit('add-todo', newTodo.value); // 'add-todo' 이벤트를 발생시키면서 입력값 전달
        newTodo.value = ''; // 입력창 초기화
    }
}

</script>

<template>
    <!--입력창 생성-->
    <input v-model="newTodo" placeholder="할 일을 입력하세요" @keyup.enter="addTodo">
    <!--사용자에게 값을 입력받고 newTodo에 저장. 엔터키를 누르면 addTodo 함수 실행-->

    <!--추가 버튼-->
    <button @click="addTodo">추가</button>
    <!--버튼을 누르면 addTodo 함수 실행-->
</template>