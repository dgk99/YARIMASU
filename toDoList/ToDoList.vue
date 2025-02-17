<script setup>

import ToDoItem from './ToDoItem.vue'; // TodoItem.vue 가져오기
// 할 일 목록을 관리하는 컴포넌트
// 전체 할 일 목록을 관리하며, 각각의 할 일을 ToDoItem.vue를 통해 표시

// 부모('App.vue')로 부터 'todos' 데이터를 받아옴
const props = defineProps(['todos']);

// 부모('App.vue')에게 삭제 요청을 보낼 수 있도록 이벤트 정의
const emit = defineEmits(['delete-todo', 'edit-todo']);
</script>

<template>
    <div>
        <!--할 일 목록이 비어 있는 경우 '할 일이 있습니다' 메시지 표시-->
        <p v-if="props.todos.length === 0">할 일이 없습니다.</p>

        <!--할 일이 있을 경우 목록을 출력-->
        <ul>
            <ToDoItem
            v-for="(todo, index) in props.todos"
            :key="todo.id"
            :todo="todo"
            :index="index"
            @delete-todo="emit('delete-todo', index)"
            @edit-todo="emit('edit-todo', $event)"
            />
        </ul>
    </div>
</template>