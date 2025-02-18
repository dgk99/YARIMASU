<script setup>
import { onMounted, ref, watch } from 'vue';
import TodoInput from './components/toDoList/ToDoInput.vue';
import TodoList from './components/toDoList/ToDoList.vue'; // TodoList.vue 추가

// 할 일 목록을 저장하는 반응형 변수
const todos = ref([]);

// 'onMounted()'를 사용해서 앱이 실행될 때 로컬 스토리지에서 데이터 불러오기
onMounted(() => {
    const savedTodos = localStorage.getItem('todos'); //로컬 스토리지에서 데이터 가져오기
    if (savedTodos) {
        todos.value = JSON.parse(savedTodos); // 문자열 -> 객체로 변환해서 'todos'에 저장장
    }
});

// 할 일 추가 함수 (TodoInput.vue에서 전달받음)
const addTodo = (todoText) => {
  todos.value.push({ id: Date.now(), text: todoText, done: false }); // 새 할 일을 추가
};

// 할 일 삭제 함수
const deleteTodo = (index) => {
    todos.value.splice(index, 1); // 해당 인덱스의 항목을 목록에서 삭제
};

// ✅ 할 일 수정 함수 (반응형 업데이트를 위해 `splice()` 사용)
const editTodo = ({ index, newText }) => {
    if (newText.trim() !== '') {
        todos.value.splice(index, 1, { ...todos.value[index], text: newText }); // ✅ 배열을 변경하는 반응형 방식
    }
};

// `watch()`를 사용해서 `todos`가 변경될 때마다 로컬 스토리지에 저장
watch(todos, (newTodos) => {
  localStorage.setItem('todos', JSON.stringify(newTodos)); // 객체 → 문자열로 변환 후 저장
}, { deep: true }); // `deep: true` 옵션 추가 → 배열 내부 값도 감지
</script>

<template>
  <h1>To-Do List</h1>

  <!-- 할 일 입력 컴포넌트 -->
  <TodoInput @add-todo="addTodo" />

  <!-- 할 일 목록 컴포넌트 (todos를 props로 전달) -->
  <TodoList :todos="todos" @delete-todo="deleteTodo" @edit-todo="editTodo" />
</template>
