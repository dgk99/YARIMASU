<template>
  <div class="mypage-container">
    <h1>마이페이지</h1>
    <p>이메일: {{ user.email }}</p>

    <div class="content-container">
      <FirstPhoto
        :photo-url="user.photoUrl"
        @capture="uploadFirstPhotoFromCamera"
      />

      <PhotoList
        :photos="photos"
        :selected-date="selectedDate"
        :grouped-photos="groupedPhotos"
        @delete-date="deletePhotosByDate"
        @capture="uploadNormalPhotoFromCamera"
        @select-date="(date) => selectedDate = date"
      />
    </div>

    <CameraModal
      v-if="showCamera"
      :mode="cameraMode"
      @captured="handleCaptured"
      @close="showCamera = false"
    />

    <button class="logout-btn" @click="logout">로그아웃</button>
    <button @click="deleteAccount">회원 탈퇴</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import FirstPhoto from '@/components/withAPI/FirstPhoto.vue'
import PhotoList from '@/components/withAPI/PhotoList.vue'
import CameraModal from '@/components/withAPI/CameraModal.vue'

const user = ref({ email: '', name: '', photoUrl: '' })
const photos = ref([])
const selectedDate = ref('')
const showCamera = ref(false)
const cameraMode = ref('normal') // 'normal' or 'first'

const groupedPhotos = computed(() => {
  const grouped = {}
  photos.value.forEach(photo => {
    const date = new Date(photo.uploaded_at).toLocaleDateString('sv-SE')
    if (!grouped[date]) grouped[date] = []
    grouped[date].push(photo)
  })
  return Object.fromEntries(Object.entries(grouped).sort((a, b) => b[0].localeCompare(a[0])))
})

const fetchUserData = () => {
  const stored = JSON.parse(localStorage.getItem('user'))
  if (stored) {
    user.value.email = stored.email
    user.value.name = stored.name
  }
}

const fetchFirstPhoto = async () => {
  try {
    const res = await axios.get(`http://210.101.236.158.nip.io:5002/api/user/first-photo/${user.value.email}`)
    user.value.photoUrl = res.data.photoUrl
  } catch {
    user.value.photoUrl = ''
  }
}

const fetchPhotos = async () => {
  const res = await axios.get(`http://210.101.236.158.nip.io:5002/api/photos/by-date/${user.value.email}/all`)
  photos.value = res.data.filter(p => p.is_first !== 1)
  const dates = Object.keys(groupedPhotos.value)
  if (dates.length > 0) selectedDate.value = dates[0]
}

const uploadNormalPhotoFromCamera = () => {
  cameraMode.value = 'normal'
  showCamera.value = true
}

const uploadFirstPhotoFromCamera = () => {
  cameraMode.value = 'first'
  showCamera.value = true
}

const handleCaptured = async (blob) => {
  const formData = new FormData()
  formData.append('photo', blob, 'captured.jpg')
  formData.append('user_email', user.value.email)

  if (cameraMode.value === 'first') {
    const res = await axios.post(`http://210.101.236.158.nip.io:5002/api/photos/first`, formData)
    user.value.photoUrl = res.data.photoUrl
  } else {
    const res = await axios.post(`http://210.101.236.158.nip.io:5002/api/photos/add`, formData)
    const newPhoto = {
      id: res.data.id,
      photo_url: res.data.photoUrl,
      uploaded_at: res.data.uploaded_at,
    }
    photos.value.push(newPhoto)
    selectedDate.value = new Date(newPhoto.uploaded_at).toLocaleDateString('sv-SE')
  }
  showCamera.value = false
}

const deletePhotosByDate = async (date) => {
  await axios.delete(`http://210.101.236.158.nip.io:5002/api/photos/delete-by-date/${user.value.email}/${date}`)
  photos.value = photos.value.filter(p => new Date(p.uploaded_at).toLocaleDateString('sv-SE') !== date)
  await fetchFirstPhoto()
}

const logout = () => {
  localStorage.removeItem('user')
  window.location.href = '/'
}

const deleteAccount = async () => {
  if (!confirm('정말 탈퇴하시겠습니까?')) return
  await axios.delete(`http://210.101.236.158.nip.io:5002/api/user/delete/${user.value.email}`)
  logout()
}

onMounted(() => {
  fetchUserData()
  fetchFirstPhoto()
  setTimeout(() => fetchPhotos(), 300)
})
</script>

<style scoped>
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
.logout-btn {
  margin-top: 30px;
  padding: 8px 16px;
}
</style>