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

      <h3>첫 등록 사진</h3>
      <img v-if="user.first_photo" :src="`http://210.101.236.158:5000/uploads/${user.first_photo}`" width="150" />

      <h3>업로드한 사진</h3>
      <div v-if="user.photos && user.photos.length">
        <div v-for="photo in user.photos" :key="photo.id">
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
      user: null, // 🔥 기본값 null
      newPhoto: null,
      isEditing: false, // 🔥 기본적으로 편집 불가능
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

          // ✅ NULL 값 방지: 값이 없을 경우 기본값 설정
          this.user.birthdate = this.user.birthdate || "2000-01-01"; // 기본값: 2000년 1월 1일
          this.user.gender = this.user.gender || "남성"; // 기본값: 남성
        } else {
          this.user = {}; // ✅ 빈 객체로 설정해서 오류 방지
        }
      } catch (error) {
        console.error("마이페이지 로딩 오류:", error);
        alert("마이페이지 정보를 불러오지 못했습니다.");
        this.$router.push("/login");
      }
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
        this.isEditing = false; // 🔥 수정 모드 종료
      } catch (error) {
        alert("정보 수정 실패!");
      }
    },
    handleFileUpload(event) {
      this.newPhoto = event.target.files[0];
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

<style scoped>
.mypage-container {
  width: 400px;
  margin: auto;
  text-align: center;
}

.edit-btn {
  background-color: blue;
  color: white;
  padding: 8px;
  margin-top: 10px;
  border: none;
  cursor: pointer;
}

.save-btn {
  background-color: green;
  color: white;
  padding: 8px;
  margin-top: 10px;
  border: none;
  cursor: pointer;
}

.delete-btn {
  background-color: red;
  color: white;
  padding: 8px;
  margin-top: 20px;
  border: none;
  cursor: pointer;
}
</style>
