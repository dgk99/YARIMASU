<template>
    <div class="camera-modal">
      <video ref="video" autoplay playsinline></video>
      <button @click="capture">📷 촬영</button>
      <button @click="$emit('close')">닫기</button>
      <canvas ref="canvas" style="display: none;"></canvas>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount, defineEmits } from 'vue'
  
  const props = defineProps({
    mode: String // 'first' 또는 'normal'
  })
  
  const emit = defineEmits(['captured', 'close'])
  
  const video = ref(null)
  const canvas = ref(null)
  let stream = null
  
  onMounted(async () => {
    stream = await navigator.mediaDevices.getUserMedia({ video: true })
    video.value.srcObject = stream
  })
  
  onBeforeUnmount(() => {
    if (stream) stream.getTracks().forEach(track => track.stop())
  })
  
  const capture = () => {
    const context = canvas.value.getContext('2d')
    canvas.value.width = video.value.videoWidth
    canvas.value.height = video.value.videoHeight
    context.drawImage(video.value, 0, 0)
    canvas.value.toBlob(blob => {
      if (blob) {
        emit('captured', blob)
      }
    }, 'image/jpeg')
  }
  </script>
  
  <style scoped>
  .camera-modal {
    position: fixed;
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
    background: #fff;
    padding: 1rem;
    border: 1px solid #ccc;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }
  video {
    width: 100%;
    max-width: 500px;
    margin-bottom: 1rem;
  }
  </style>