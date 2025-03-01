<template>
  <div class="mypage-container">
    <h2>마이페이지</h2>

    <div v-if="user === null">
      <p>로딩 중...</p> <!-- ✅ user가 없을 때 로딩 표시 -->
    </div>

    <div v-else>
      <p><strong>이메일:</strong> {{ user.email }}</p>

      <p><strong>이름:</strong></p>
      <input v-model="user.name" :readonly="!isEditing" />

      <p><strong>키:</strong></p>
      <input type="number" v-model="user.height" :readonly="!isEditing" />

      <p><strong>생년월일:</strong></p>
      <input type="date" v-model="user.birthdate" :readonly="!isEditing" />

      <p><strong>성별:</strong></p>
      <select v-model="user.gender" :disabled="!isEditing">
        <option value="남성">남성</option>
        <option value="여성">여성</option>
      </select>

      <!-- 수정 버튼 -->
      <button v-if="!isEditing" @click="isEditing = true" class="edit-btn">정보 수정</button>

      <!-- 저장 버튼 (수정 중일 때만 표시) -->
      <button v-if="isEditing" @click="updateProfile" class="save-btn">저장</button>

      <!-- 로그아웃 버튼 -->
      <button class="logout-btn" @click="logout">로그아웃</button>

      <h3>첫 등록 사진</h3>
      <img v-if="user.first_photo" :src="`http://210.101.236.158:5000/uploads/${user.first_photo}`" width="150" />

      <h3>업로드한 사진</h3>
      <div v-if="Object.keys(photoGroups).length">
        <div v-for="(photos, date) in photoGroups" :key="date">
          <button @click="selectedDate = date">{{ date }}</button>
        </div>
      </div>

      <h3>선택한 날짜의 사진</h3>
      <div v-if="selectedDate && photoGroups[selectedDate]">
        <div v-for="photo in photoGroups[selectedDate]" :key="photo.id">
          <img :src="`http://210.101.236.158:5000/uploads/${photo.filename}`" width="100" />
          <button @click="deletePhoto(photo.id)">삭제</button>
        </div>
      </div>

      <h3>사진 업로드</h3>
      <input type="file" @change="handleFileUpload" />
      <button @click="uploadPhoto">업로드</button>

      <button class="delete-btn" @click="deleteAccount">회원 탈퇴</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      user: null,
      newPhoto: null,
      isEditing: false,
      photoGroups: {}, // ✅ 연도-월-일 그룹화된 사진 데이터
      selectedDate: null, // ✅ 선택된 날짜
    };
  },
  async mounted() {
    await this.fetchUserData();
  },
  methods: {
    async fetchUserData() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("로그인이 필요합니다.");
          this.$router.push("/login");
          return;
        }

        const response = await axios.get("http://210.101.236.158:5000/api/mypage", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          this.user = response.data;
          
          // ✅ birthdate 값이 올바르게 표시되도록 확인
          if (!this.user.birthdate || this.user.birthdate === "0000-00-00") {
            this.user.birthdate = "2000-01-01"; // 기본값
          }

          this.user.gender = this.user.gender || "남성";
          
          // ✅ 사진 데이터 그룹화
          this.groupPhotosByDate(response.data.photos);
        } else {
          this.user = {};
        }
      } catch (error) {
        console.error("마이페이지 로딩 오류:", error);
        alert("마이페이지 정보를 불러오지 못했습니다.");
        this.$router.push("/login");
      }
    },

    groupPhotosByDate(photos) {
      const grouped = {};
      photos.forEach(photo => {
        const date = photo.filename.split("_")[0]; // YYYY-MM-DD 형식 추출
        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(photo);
      });
      this.photoGroups = grouped;
    },

    async updateProfile() {
      try {
        const token = localStorage.getItem("token");
        await axios.put("http://210.101.236.158:5000/api/mypage/update", {
          name: this.user.name,
          height: this.user.height,
          birthdate: this.user.birthdate,
          gender: this.user.gender,
        }, { headers: { Authorization: `Bearer ${token}` } });

        alert("정보가 수정되었습니다.");
        this.isEditing = false;
      } catch (error) {
        alert("정보 수정 실패!");
      }
    },

    async logout() {
      localStorage.removeItem("token");
      alert("로그아웃 되었습니다.");
      this.$router.push("/login");
    },

    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.newPhoto = file; 
        console.log("선택한 파일:", file.name); // ✅ 선택한 파일 확인
      } else {
        this.newPhoto = null;
      }
    },

    async uploadPhoto() {
      if (!this.newPhoto) return alert("사진을 선택하세요!");

      try {
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("photo", this.newPhoto);

        await axios.post("http://210.101.236.158:5000/api/mypage/upload", formData, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });

        alert("사진 업로드 성공!");
        this.fetchUserData();
      } catch (error) {
        alert("사진 업로드 실패!");
      }
    },

    async deletePhoto(photoId) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://210.101.236.158:5000/api/mypage/photo/${photoId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("사진이 삭제되었습니다.");
        this.fetchUserData();
      } catch (error) {
        alert("사진 삭제 실패!");
      }
    },

    async deleteAccount() {
      if (!confirm("정말로 탈퇴하시겠습니까?")) return;

      try {
        const token = localStorage.getItem("token");
        await axios.delete("http://210.101.236.158:5000/api/mypage/delete", {
          headers: { Authorization: `Bearer ${token}` },
        });

        alert("회원 탈퇴 완료!");
        localStorage.removeItem("token");
        this.$router.push("/login");
      } catch (error) {
        alert("회원 탈퇴 실패!");
      }
    },
  },
};
</script>
