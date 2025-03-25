<template>
  <div class="login-container">
    <h1>Google 로그인</h1>
    <div id="google-login-button" style="margin-top: 20px;"></div>
    <button @click="requestAccessToken" style="margin-top: 20px;">Google로 로그인</button>
  </div>
</template>

<script setup>
import { onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";

const clientId = "787301281179-7jt90v7johb6qqoogsto9fvtqch3hjvr.apps.googleusercontent.com";
const router = useRouter();
let tokenClient = null; // 전역에 저장

// 엑세스 토큰 요청 함수
const requestAccessToken = () => {
  if (tokenClient) {
    tokenClient.requestAccessToken();
  } else {
    console.error("❌ tokenClient가 초기화되지 않았습니다.");
  }
};

// 페이지 로드 후 실행
onMounted(async () => {
  await nextTick(); // DOM 준비 기다림

  // Google API 로드
  function loadGoogleScript(callback) {
    if (window.google && window.google.accounts) {
      callback();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.onload = callback;
    script.onerror = () => console.error("Google API 로드 실패!");
    document.head.appendChild(script);
  }

  // Google API 초기화
  loadGoogleScript(() => {
    // 엑세스 토큰 클라이언트 초기화
    tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: "openid email profile",
      callback: (response) => {
        console.log("✅ Google Access Token:", response.access_token);

        fetch("http://210.101.236.158.nip.io:5002/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken: response.access_token }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("✅ 서버 응답:", data);
            localStorage.setItem("user", JSON.stringify(data));
            router.push("/mypage");
          })
          .catch((err) => console.error("❌ 로그인 실패:", err));
      },
    });

    console.log("✅ Google 로그인 버튼 렌더링 완료");
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