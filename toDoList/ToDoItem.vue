<script setup>
import { ref } from 'vue';
// 개별 할 일 항목을 표시하는 컴포넌트
// 개별 할 일 항목을 표시하며, 체크박스(완료), 삭제 버튼 기능 포함

// 부모('TodoList.vue')에서 'todo'(할 일 데이터)와 'index'(목록 순서)를 전달받음
const props = defineProps(['todo', 'index'])

// 부모('TodoList.vue')에게 삭제 요청을 보낼 수 있도록 이벤트 정의
const emit = defineEmits(['delete-todo', 'edit-todo']); // 부모에게 삭제 & 수정 요청을 보낼 수 있도록 설정



const isEditing = ref(false); // 수정 모드 여부
const editedText = ref('') // 수정 중인 텍스트

// '수정' 버튼을 클릭하면 편집 모드로 전환
const startEditing = () => {
    isEditing.value = true;
    editedText.value = props.todo.text; // 기존 텍스트를 입력창에 표시
};

// ✅ "저장" 버튼을 클릭하면 수정된 내용을 부모에게 전달
const saveEdit = () => {
    if (editedText.value.trim() !== '') {
        emit('edit-todo', { index: props.index, newText: editedText.value }); // ✅ 수정된 텍스트를 부모에게 전달
        isEditing.value = false; // 수정 모드 종료
    }
};
</script>

<template>
    <li>
        <!--수정 모드일 때-->
        <template v-if="isEditing">
            <input v-model="editedText" />
            <button @click="saveEdit">저장</button>
        </template>

        <!--기본 모드 (수정 중이 아닐 때)-->
        <template v-else>
            <input type="checkbox" v-model="todo.done" />
            <span :class="{ completed: todo.done }">{{ todo.text }}</span>
            <button @click="startEditing">수정</button> <!--수정 버튼 추가-->
            <button @click="emit('delete-todo', index)">삭제</button>
        </template>
    </li>
</template>

<style>
/* 할 일이 완료되면 글씨에 취소선 + 회색 적용*/
.completed{
    text-decoration: line-through;
    color: gray;
}
</style>