<template>
  <div class="login-container">
    <h1>Google 로그인</h1>
    <div id="g_id_onload"></div>
    <div id="google-login-button" class="g_id_signin"></div>
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
  window.handleCredentialResponse = handleCredentialResponse;

  await nextTick(); // DOM 업데이트 후 실행

  if (window.google && window.google.accounts) {
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCredentialResponse,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("google-login-button"),
      { theme: "outline", size: "large" }
    );
  } else {
    console.error("Google 로그인 API를 불러올 수 없습니다.");
  }
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