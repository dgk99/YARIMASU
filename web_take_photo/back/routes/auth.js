const express = require("express");
const router = express.Router();
const { OAuth2Client } = require("google-auth-library");
const fetch = require("node-fetch");
const db = require("../db");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ✅ Google 로그인 & 회원 여부 확인
// routes/auth.js
router.post("/google", async (req, res) => {
  const { accessToken } = req.body;

  if (!accessToken) {
    return res.status(400).json({ success: false, message: "Access Token 없음" });
  }

  try {
    // 기존 코드 그대로
    const userInfoResponse = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`);
    const userInfo = await userInfoResponse.json();
    const userEmail = userInfo.email;

    console.log("✅ Google 사용자 정보:", userInfo);

    // DB에서 회원 여부 확인
    const [rows] = await db.query("SELECT 1 FROM kmg_api WHERE user_email = ? LIMIT 1", [userEmail]);

    let fixedPhoto = "";
    const [firstPhoto] = await db.query("SELECT photo_url FROM kmg_api WHERE user_email = ? AND is_first = 1 LIMIT 1", [userEmail]);
    if (firstPhoto.length > 0) {
      fixedPhoto = firstPhoto[0].photo_url;
    }

    res.json({ email: userEmail }); // 응답
  } catch (error) {
    console.error("Google 로그인 오류:", error);
    res.status(400).json({ success: false, message: "토큰 검증 실패" });
  }
});

module.exports = router;