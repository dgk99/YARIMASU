<template>
    <div class="date-list">
      <h2>목록</h2>
      <div
        v-for="(photos, date) in groupedPhotos"
        :key="date"
        class="date-item"
      >
        <button @click="$emit('select-date', date)" :class="{ active: selectedDate === date }">{{ date }}</button>
        <button @click.stop="$emit('delete-date', date)" class="delete-btn">삭제</button>
      </div>
  
      <button class="add-btn" @click="$emit('capture')">📸 일반 사진 촬영</button>
  
      <!-- 선택된 날짜 사진 보여주기 -->
      <div class="selected-photo-box">
        <h2>사진</h2>
        <div v-if="selectedDate && groupedPhotos[selectedDate]?.length > 0">
          <img :src="getPhotoUrl(groupedPhotos[selectedDate][0].photo_url)" class="photo" />
        </div>
        <div v-else>
          <p>해당 날짜에 사진이 없습니다.</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    photos: Array,
    selectedDate: String,
    groupedPhotos: Object
  })
  
  const getPhotoUrl = (url) => {
    if (!url || url.startsWith("https://lh3.googleusercontent.com")) return ""
    return url.startsWith("http") ? url : `http://210.101.236.158.nip.io:5002${url}`
  }
  </script>
  
  <style scoped>
  .date-list {
    width: 30%;
    padding: 10px;
  }
  .date-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  .date-item .active {
    background-color: red;
    color: white;
  }
  .delete-btn {
    background-color: red;
    color: white;
    border: none;
    padding: 3px 6px;
    cursor: pointer;
  }
  .add-btn {
    margin-top: 10px;
    font-size: 18px;
    padding: 5px 10px;
  }
  .selected-photo-box {
    margin-top: 20px;
  }
  .photo {
    width: 100%;
    max-height: 400px;
    object-fit: contain;
    border: 2px solid #ccc;
  }
  </style>