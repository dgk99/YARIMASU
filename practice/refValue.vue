<script setup>
import { reactive } from 'vue';

const state = reactive({ count: 0 });
</script>

<template>
  <p>카운트: {{ state.count }}</p>
  <button @click="state.count++">+1 증가</button>
</template>
