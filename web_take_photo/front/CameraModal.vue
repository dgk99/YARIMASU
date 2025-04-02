<template>
  <div class="camera-modal">
    <video ref="video" autoplay playsinline muted></video>
    <canvas ref="canvas"></canvas>
    <div class="button-box">
      <button @click="capture">📸 촬영</button>
      <button @click="$emit('close')">닫기</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, defineEmits } from 'vue'
import * as mpPose from '@mediapipe/pose'
import * as mpCamera from '@mediapipe/camera_utils'
import * as mpDrawing from '@mediapipe/drawing_utils'

const emit = defineEmits(['captured', 'close'])
const video = ref(null)
const canvas = ref(null)
let camera = null
let pose = null
let stream = null

const drawResults = (results) => {
  const ctx = canvas.value.getContext('2d')
  const w = canvas.value.width
  const h = canvas.value.height

  ctx.clearRect(0, 0, w, h)
  ctx.drawImage(results.image, 0, 0, w, h)

  if (results.poseLandmarks) {
    const landmarks = results.poseLandmarks

    // ✅ 스켈레톤 먼저 그림
    mpDrawing.drawConnectors(ctx, landmarks, mpPose.POSE_CONNECTIONS, {
      color: '#00FF00',
      lineWidth: 2
    })
    mpDrawing.drawLandmarks(ctx, landmarks, {
      color: '#FF0000',
      lineWidth: 1
    })

    // ✅ 스켈레톤 그린 뒤 텍스트를 그림 (순서 중요!)
    const ear = landmarks[8]
    const shoulder = landmarks[12]

    const dx = ear.x - shoulder.x
    const dy = ear.y - shoulder.y
    const angleRad = Math.atan2(dy, dx)
    const angleDeg = Math.abs(angleRad * (180 / Math.PI))

    const isTurtleNeck = angleDeg > 45

    ctx.font = '20px Arial'
    ctx.fillStyle = isTurtleNeck ? 'red' : 'green'
    ctx.fillText(`거북목 각도: ${angleDeg.toFixed(1)}°`, 10, 30)
    
    ctx.beginPath()
    ctx.moveTo(ear.x * w, ear.y * h) // 시작: 귀
    ctx.lineTo(shoulder.x * w, shoulder.y * h) // 끝: 어깨
    ctx.strokeStyle = isTurtleNeck ? 'red' : 'green'
    ctx.lineWidth = 2
    ctx.stroke()

    const leftShoulder = landmarks[11]  // 왼쪽 어깨
    const rightShoulder = landmarks[12] // 오른쪽 어깨

    const dyShoulder = leftShoulder.y - rightShoulder.y
    const shoulderTiltDeg = dyShoulder * 180 // 단순 각도 비슷하게 환산

    // 📏 어깨 기울기 판단 기준: 10도 이상이면 기울어짐
    const isTilted = Math.abs(shoulderTiltDeg) > 10

    ctx.fillStyle = isTilted ? 'orange' : 'blue'
    ctx.fillText(`어깨 기울기: ${shoulderTiltDeg.toFixed(1)}°`, 10, 60)
  }
}

onMounted(async () => {
  pose = new mpPose.Pose({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
  })

  pose.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    enableSegmentation: false,
    smoothSegmentation: false,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  })

  pose.onResults(drawResults)

  stream = await navigator.mediaDevices.getUserMedia({ video: true })
  video.value.srcObject = stream

  await new Promise(resolve => {
    video.value.onloadeddata = () => {
      console.log('✅ video loaded:', video.value.videoWidth, video.value.videoHeight)
      canvas.value.width = video.value.videoWidth
      canvas.value.height = video.value.videoHeight
      resolve()
    }
  })

  await video.value.play()

  camera = new mpCamera.Camera(video.value, {
    onFrame: async () => {
      await pose.send({ image: video.value })
    },
    width: video.value.videoWidth,
    height: video.value.videoHeight
  })

  camera.start()
})

onBeforeUnmount(() => {
  if (camera) camera.stop()
})

const capture = () => {
  canvas.value.toBlob(blob => {
    if (blob) emit('captured', blob)
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
canvas {
  width: 100%;
  max-width: 640px; /* 화면에 보일 크기 */
  margin-bottom: 1rem;
  border: 1px solid #aaa;
}
video {
  display: none; /* 실제로 렌더링은 되지만 안 보이게 */
}
.button-box {
  display: flex;
  justify-content: center;
  gap: 10px;
}
</style>
