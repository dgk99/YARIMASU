<template>
  <div class="mypage-container">
    <h1>마이페이지</h1>
    <p>이메일: {{ user.email }}</p>

    <div class="content-container">
      <!-- ✅ 왼쪽: 처음 찍은 사진 (대표 사진) -->
      <div class="fixed-photo-box">
        <h2>처음 찍은 사진</h2>
        <img :src="getPhotoUrl(user.photoUrl)" class="fixed-photo" v-if="user.photoUrl" />
      </div>

      <!-- ✅ 가운데: 선택한 날짜의 사진 1장 -->
      <div class="selected-photo-box">
        <h2>사진</h2>
        <div v-if="selectedDate && groupedPhotos[selectedDate]?.length > 0">
          <img :src="getPhotoUrl(groupedPhotos[selectedDate][0].photo_url)" class="photo" />
        </div>
        <div v-else>
          <p>해당 날짜에 사진이 없습니다.</p>
        </div>
      </div>

      <!-- ✅ 오른쪽: 날짜 목록 + 삭제 + 업로드 -->
      <div class="date-list">
        <h2>목록</h2>
        <div v-for="(photos, date) in groupedPhotos" :key="date" class="date-item">
          <button @click="selectedDate = date" :class="{ active: selectedDate === date }">{{ date }}</button>
          <button @click.stop="deletePhotosByDate(date)" class="delete-btn">삭제</button>
        </div>
        <button class="add-btn" @click="triggerFileInput">+</button>
        <input type="file" ref="fileInput" @change="uploadPhoto" style="display: none;" />
      </div>
    </div>

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
    photos.value = response.data.filter(photo => photo.is_first !== 1);

    // 최신 날짜로 기본 선택
    const dates = Object.keys(groupedPhotos.value);
    if (dates.length > 0) {
      selectedDate.value = dates[0];
    }
  } catch (error) {
    console.error("❌ 사진 불러오기 오류:", error);
  }
};

// ✅ 2. 날짜별 그룹화
const groupedPhotos = computed(() => {
  const grouped = {};

  photos.value.forEach(photo => {
    const date = new Date(photo.uploaded_at);
    const formattedDate = date.toLocaleDateString("sv-SE"); // ✅ 여기 이렇게 바꿔야 함

    if (!grouped[formattedDate]) grouped[formattedDate] = [];
    grouped[formattedDate].push(photo);
  });

  return Object.fromEntries(Object.entries(grouped).sort((a, b) => b[0].localeCompare(a[0])));
});

// ✅ 3. 사진 업로드 (새로고침 없이 반영)
const uploadPhoto = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  console.log("📸 [사진 업로드 시작]:", file.name);  // ✅ 업로드 시작 로그 추가

  const formData = new FormData();
  formData.append("photo", file);
  formData.append("user_email", user.value.email);

  try {
    const response = await axios.post("http://210.101.236.158.nip.io:5002/api/photos/add", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("📸 [서버 응답]:", response.data);

    // ✅ 업로드된 사진을 즉시 반영
    const uploadedAt = new Date(response.data.uploaded_at).toISOString().replace("T", " ").substring(0, 19);
    const newPhoto = {
      id: response.data.id,
      photo_url: response.data.photoUrl,
      uploaded_at: response.data.uploaded_at,
    };

    photos.value.push(newPhoto);
    console.log("✅ [현재 photos 배열]:", photos.value);  // ✅ photos 배열 확인

    // ✅ 업로드된 날짜를 selectedDate로 설정 (추가)
    selectedDate.value = new Date(newPhoto.uploaded_at).toLocaleDateString("sv-SE");

  } catch (error) {
    console.error("❌ 사진 업로드 오류:", error);
  }
};

// ✅ 4. 날짜별 사진 삭제
const deletePhotosByDate = async (date) => {
  try {
    console.log(`🚀 [삭제 요청] 원본 날짜: ${date}`);

    // ✅ 날짜 그대로 사용 (변환 X)
    const formattedDate = date;
    console.log(`✅ 변환된 날짜 형식: ${formattedDate}`);

    const apiUrl = `http://210.101.236.158.nip.io:5002/api/photos/delete-by-date/${user.value.email}/${formattedDate}`;
    console.log("🛠️ DELETE 요청 URL:", apiUrl);

    const response = await axios.delete(apiUrl);
    console.log("✅ [삭제 완료] 서버 응답:", response.data);

    // ✅ 프론트엔드에서도 삭제된 데이터 반영
    photos.value = photos.value.filter(photo => {
      const photoDate = new Date(photo.uploaded_at).toLocaleDateString("sv-SE");
      return photoDate !== formattedDate;
    });

    console.log(`✅ [삭제 후 photos 배열]:`, photos.value);
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

  // ❌ Google 이미지면 무시
  if (photoUrl.startsWith("https://lh3.googleusercontent.com")) return "";

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
// 기존 user 설정 로직에서 photoUrl 제거
const fetchUserData = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (storedUser) {
    user.value.email = storedUser.email;
    user.value.name = storedUser.name;
    // ✅ photoUrl은 무시하고, 아래에서 따로 불러옴
  }
};

// ✅ 대표 사진은 무조건 따로 불러오기
const fetchFirstPhoto = async () => {
  try {
    const res = await axios.get(`http://210.101.236.158.nip.io:5002/api/user/first-photo/${user.value.email}`);
    user.value.photoUrl = res.data.photoUrl;
  } catch (err) {
    console.warn("대표 사진 없음 → 숨김 처리");
    user.value.photoUrl = ""; // 아무것도 안 보이게
  }

  console.log("📨 대표 사진 요청 email:", user.value.email);ß
};

onMounted(async () => {
  fetchUserData(); // ✅ 로컬 유저 정보 먼저 불러오고

  await fetchFirstPhoto(); // ✅ 대표 사진 바로 불러오기

  setTimeout(() => {
    fetchPhotos(); // ✅ 그 다음에 날짜별 사진 불러오기
  }, 300);
});

</script>

<style>
.mypage-container {
  text-align: center;
  margin-top: 20px;
}

.content-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 20px;
}

.fixed-photo-box,
.selected-photo-box,
.date-list {
  width: 30%;
  padding: 10px;
  box-sizing: border-box;
}

/* 대표 사진 */
.fixed-photo {
  width: 100%;
  max-height: 400px;
  object-fit: contain;
  border: 2px solid #ccc;
}

/* 가운데 사진 */
.photo {
  width: 100%;
  max-height: 400px;
  object-fit: contain;
  border: 2px solid #ccc;
}

.date-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.date-item button {
  margin-right: 5px;
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

.logout-btn {
  margin-top: 30px;
  padding: 8px 16px;
}
</style>