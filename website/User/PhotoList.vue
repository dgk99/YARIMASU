<script setup>
import { ref, onMounted } from 'vue';

// 사진 목록과 선택된 사진 저장
const photoList = ref([]);
const selectedPhoto = ref(null);

// 로컬 스토리지에서 사진 목록 불러오기
onMounted(() => {
    const storedPhotos = JSON.parse(localStorage.getItem("photoList")) || [];
    photoList.value = storedPhotos;

    // 기본적으로 첫 번째 사진을 선택된 사진으로 설정
    if (photoList.value.length > 0) {
        selectedPhoto.value = photoList.value[0].src;
    }
});

// 사진 추가 함수
const addPhoto = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const newPhoto = {
                date: new Date().toISOString().slice(0, 10), // 현재 날짜 (YYYY-MM-DD 형식)
                src: reader.result,
            };

            photoList.value.push(newPhoto);
            localStorage.setItem("photoList", JSON.stringify(photoList.value));

            // 가장 최근 추가된 사진을 선택된 사진으로 변경
            selectedPhoto.value = newPhoto.src;
        };
    }
};

// 사진 삭제 함수
const deletePhoto = (index) => {
    photoList.value.splice(index, 1);
    localStorage.setItem("photoList", JSON.stringify(photoList.value));

    // 삭제 후 첫 번째 사진을 기본으로 설정
    if (photoList.value.length > 0) {
        selectedPhoto.value = photoList.value[0].src;
    } else {
        selectedPhoto.value = null;
    }
};

// 클릭한 날짜의 사진 표시
const showPhoto = (photoSrc) => {
    selectedPhoto.value = photoSrc;
};
</script>

<template>
    <h3>사진 목록</h3>

    <!-- 사진 미리보기 -->
    <div v-if="selectedPhoto">
        <h4>선택된 사진</h4>
        <img :src="selectedPhoto" alt="선택된 사진" style="max-width: 150px;">
    </div>

    <!-- 날짜별 사진 목록 -->
    <ul>
        <li v-for="(photo, index) in photoList" :key="index">
            <span @click="showPhoto(photo.src)">{{ photo.date }}</span>
            <button @click="deletePhoto(index)">삭제</button>
        </li>
    </ul>

    <!-- 사진 업로드 -->
    <input type="file" @change="addPhoto" accept="image/*">
</template>
