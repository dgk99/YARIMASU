<script setup>
defineProps(['name']); // 부모 컴포넌트에서 'name'을 받을 수 있도록 설정
</script>

<template>
    <h2>안녕, {{ name }}</h2>
</template>