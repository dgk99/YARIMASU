<template>
  <div class="mypage-container">
    <h1>마이페이지</h1>
    <img :src="user.photoUrl" class="profile-img" v-if="user.photoUrl" />
    <p>이메일: {{ user.email }}</p>
    <p>이름: {{ user.name }}</p>

    <div class="content-container">
      <!-- ✅ 날짜별 리스트 -->
      <div class="photo-list">
        <h2>Photo List</h2>

        <div v-for="(photos, date) in groupedPhotos" :key="date" class="date-item">
          <button @click="selectedDate = date" :class="{ active: selectedDate === date }">
            {{ date }}
          </button>
          <button @click.stop="deletePhotosByDate(date)" class="delete-btn">삭제</button>
        </div>

        <button class="add-btn" @click="triggerFileInput">+</button>
        <input type="file" ref="fileInput" @change="uploadPhoto" style="display: none;">
      </div>

      <!-- ✅ 선택한 날짜의 사진만 표시 -->
      <div class="photo-view">
        <h2 v-if="selectedDate">{{ selectedDate }}</h2>
        <div class="photo-grid" v-if="groupedPhotos[selectedDate]">
          <div v-for="photo in groupedPhotos[selectedDate]" :key="photo.id" class="photo-item">
            <img :src="getPhotoUrl(photo.photo_url)" class="photo" />
          </div>
        </div>
      </div>
    </div>

    <!-- ✅ 로그아웃 -->
    <button class="logout-btn" @click="logout">로그아웃</button>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";

const user = ref({ email: "", name: "", photoUrl: "" });
const photos = ref([]);
const selectedDate = ref("");
const fileInput = ref(null);

// ✅ 1. 서버에서 사진 가져오기
const fetchPhotos = async () => {
  try {
    console.log("🚀 fetchPhotos 실행됨!");
    console.log("📨 요청 URL:", `http://210.101.236.158.nip.io:5002/api/photos/by-date/${user.value.email}/all`);

    const response = await axios.get(`http://210.101.236.158.nip.io:5002/api/photos/by-date/${user.value.email}/all`);
    
    console.log("📸 서버 응답 데이터:", response.data);
    photos.value = response.data;

    // 최신 날짜로 기본 선택
    const dates = Object.keys(groupedPhotos.value);
    if (dates.length > 0) {
      selectedDate.value = dates[0];
    }
  } catch (error) {
    console.error("❌ 사진 불러오기 오류:", error);
  }
};

// ✅ 2. 날짜별 그룹화 (년-월-일 시:분:초)
const groupedPhotos = computed(() => {
  const grouped = {};
  
  photos.value.forEach(photo => {
    const date = new Date(photo.uploaded_at);
    const formattedDate = date.toISOString().replace("T", " ").substring(0, 19); // "년-월-일 시:분:초" 형식

    if (!grouped[formattedDate]) grouped[formattedDate] = [];
    grouped[formattedDate].push(photo);
  });

  return Object.fromEntries(Object.entries(grouped).sort((a, b) => b[0].localeCompare(a[0])));
});

// ✅ 3. 사진 업로드 (새로고침 없이 반영)
const uploadPhoto = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("photo", file);
  formData.append("user_email", user.value.email);

  try {
    const response = await axios.post("http://210.101.236.158.nip.io:5002/api/photos/add", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // ✅ 새로 추가된 사진을 즉시 반영
    const uploadedAt = new Date(response.data.uploaded_at).toISOString().replace("T", " ").substring(0, 19);

    const newPhoto = {
      id: response.data.id,
      photo_url: response.data.photoUrl,
      uploaded_at: uploadedAt,
    };

    photos.value.push(newPhoto);
    console.log("✅ 새 사진 추가됨:", newPhoto);

    selectedDate.value = uploadedAt; // ✅ 추가된 날짜 선택
  } catch (error) {
    console.error("사진 업로드 오류:", error);
  }
};

// ✅ 4. 날짜별 사진 삭제
const deletePhotosByDate = async (date) => {
  try {
    console.log(`🚀 [삭제 요청] 날짜: ${date}`);
    
    await axios.delete(`http://210.101.236.158.nip.io:5002/api/photos/delete-by-date/${user.value.email}/${date}`);

    // ✅ 해당 날짜의 사진을 필터링해서 삭제
    photos.value = photos.value.filter(photo => {
      const photoDate = new Date(photo.uploaded_at).toISOString().replace("T", " ").substring(0, 19);
      return photoDate !== date;
    });

    console.log(`✅ [삭제 완료] ${date}의 사진 삭제됨`);
    
    // ✅ 삭제 후 다른 날짜 선택
    const remainingDates = Object.keys(groupedPhotos.value);
    selectedDate.value = remainingDates.length > 0 ? remainingDates[0] : "";
  } catch (error) {
    console.error("❌ 날짜별 사진 삭제 오류:", error);
  }
};

// ✅ 5. 로그아웃
const logout = () => {
  localStorage.removeItem("user");
  window.location.href = "/";
};

// ✅ 6. 파일 선택 트리거
const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

// ✅ 7. 사진 URL 처리
const getPhotoUrl = (photoUrl) => {
  if (!photoUrl) return ""; 
  return photoUrl.startsWith("http")
    ? photoUrl
    : `http://210.101.236.158.nip.io:5002${photoUrl}`;
};

onMounted(() => {
  fetchUserData();

  setTimeout(() => {
    console.log("🚀 fetchPhotos 실행 (user.email 확인 후)");
    fetchPhotos();
  }, 500);
});

// ✅ 8. 사용자 정보 불러오기
const fetchUserData = () => {
  console.log("🚀 fetchUserData 실행됨!");
  
  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (storedUser) {
    console.log("✅ 로컬스토리지에서 가져온 사용자 데이터:", storedUser);
    user.value = storedUser;
  } else {
    console.error("❌ 로컬스토리지에서 사용자 정보를 찾을 수 없음!");
  }
};
</script>

<style>
.mypage-container {
  text-align: center;
  margin-top: 20px;
}
.profile-img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.content-container {
  display: flex;
  justify-content: space-between;
}

/* ✅ 날짜 리스트 스타일 */
.photo-list {
  width: 250px;
  border-right: 2px solid #ccc;
  padding-right: 10px;
}

.date-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 5px 0;
}

.photo-list button {
  background: #f5f5f5;
  border: 1px solid #ccc;
  padding: 5px;
  margin: 5px 0;
  cursor: pointer;
  width: 100%;
  text-align: left;
}

.photo-list button.active {
  background: red;
  color: white;
}

.delete-btn {
  background-color: red;
  color: white;
  padding: 5px;
  border: none;
  cursor: pointer;
}

.add-btn {
  font-size: 20px;
  padding: 10px;
  display: block;
  width: 100%;
}

.photo-view {
  flex: 1;
  padding-left: 10px;
}

.photo-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>