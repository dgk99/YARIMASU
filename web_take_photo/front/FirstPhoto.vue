<template>
    <div class="fixed-photo-box">
      <h2>처음 찍은 사진</h2>
      <img :src="getPhotoUrl(photoUrl)" class="fixed-photo" v-if="photoUrl" />
      <button @click="$emit('capture')">📸 대표 사진 촬영</button>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    photoUrl: String
  })
  
  const getPhotoUrl = (url) => {
    if (!url || url.startsWith("https://lh3.googleusercontent.com")) return ""
    return url.startsWith("http") ? url : `http://210.101.236.158.nip.io:5002${url}`
  }
  </script>
  
  <style scoped>
  .fixed-photo-box {
    width: 30%;
    padding: 10px;
  }
  .fixed-photo {
    width: 100%;
    max-height: 400px;
    object-fit: contain;
    border: 2px solid #ccc;
  }
  </style>