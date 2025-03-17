<template>
  <div class="login-container">
    <h1>Google 로그인</h1>
    <div id="google-login-button"></div>
  </div>
</template>

<script setup>
import { onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";

const clientId = "787301281179-7jt90v7johb6qqoogsto9fvtqch3hjvr.apps.googleusercontent.com"; // Google Cloud에서 발급한 클라이언트 ID
const router = useRouter();

const handleCredentialResponse = (response) => {
  console.log("Google ID Token:", response.credential);

  fetch("http://210.101.236.158.nip.io:5002/api/auth/google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken: response.credential }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("서버 응답:", data);
      localStorage.setItem("user", JSON.stringify(data)); // 로그인 정보 저장
      router.push("/mypage"); // 마이페이지로 이동
    })
    .catch((err) => console.error("로그인 실패:", err));
};

onMounted(async () => {
  // Google API가 로드될 때까지 대기하는 함수
  function loadGoogleScript(callback) {
    if (window.google && window.google.accounts) {
      callback(); // 이미 로드됨
      return;
    }

    // 동적으로 Google API 스크립트 추가
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.onload = callback;
    script.onerror = () => console.error("Google API 로드 실패!");
    document.head.appendChild(script);
  }

  // Google API가 로드된 후 initialize 실행
  loadGoogleScript(() => {
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCredentialResponse,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("google-login-button"),
      { theme: "outline", size: "large" }
    );

    console.log("✅ Google 로그인 버튼이 정상적으로 초기화되었습니다.");
  });
});
</script>

<style>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
}
</style>