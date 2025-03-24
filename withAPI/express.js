require("dotenv").config();
const express = require("express");
const mysql = require("mysql2/promise");
const { OAuth2Client } = require("google-auth-library");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const moment = require("moment-timezone");
const fetch = require("node-fetch");

const app = express();
app.use(bodyParser.json());

app.use(cors({
  origin: ["http://localhost:5173", "http://210.101.236.158.nip.io", 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // 허용할 HTTP 메서드
  allowedHeaders: ['Content-Type', 'Authorization'],  // 허용할 헤더
  credentials: true  // 인증 정보(쿠키 등) 포함 허용
}));

app.get('/', (req, res) => {
  res.send('CORS 설정 완료');
});

app.use('/uploads', express.static('uploads', {
  setHeaders: (res) => {
      res.set('Access-Control-Allow-Origin', '*'); // CORS 허용
  }
}));

// Google OAuth2 클라이언트 설정
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// MySQL 연결
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// ✅ 1️⃣ Google 로그인 & 회원 여부 확인
// ✅ Google 로그인 & 회원 여부 확인
app.post("/api/auth/google", async (req, res) => {
  const { accessToken } = req.body;

  if (!accessToken) {
    return res.status(400).json({ success: false, message: "Access Token 없음" });
  }

  try {
    // ✅ Google API를 사용하여 사용자 정보 가져오기
    const userInfoResponse = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`);
    const userInfo = await userInfoResponse.json();

    console.log("✅ Google 사용자 정보:", userInfo);

    const userEmail = userInfo.email;
    const photoUrl = userInfo.picture || "";

    // ✅ 1. 기존 회원 여부 확인 (`kmg_api` 테이블 사용)
    const [rows] = await db.query("SELECT * FROM kmg_api WHERE user_email = ?", [userEmail]);

    if (rows.length === 0) {
      // ✅ 2. 회원이 없으면 `kmg_api`에 추가
      await db.query(
        "INSERT INTO kmg_api (user_email, photo_url) VALUES (?, ?)",
        [userEmail, photoUrl]
      );
    }

    res.json({ email: userEmail, photoUrl });

  } catch (error) {
    console.error("Google 로그인 오류:", error);
    res.status(400).json({ success: false, message: "토큰 검증 실패" });
  }
});

// ✅ 1. 사진 저장을 위한 Multer 설정
const storage = multer.diskStorage({
  destination: "./uploads/", // 업로드된 파일이 저장될 폴더
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // 파일명 설정
  },
});
const upload = multer({ storage });

// ✅ 2. 사진 업로드 API
app.post("/api/photos/add", upload.single("photo"), async (req, res) => {
  const { user_email } = req.body;
  const photoUrl = `/uploads/${req.file.filename}`;
  const uploadedAt = moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");

  try {
    console.log(`🚀 [사진 업로드 요청] 이메일: ${user_email}, 파일: ${photoUrl}, 업로드 시간: ${uploadedAt}`);

    const [result] = await db.query(
      "INSERT INTO kmg_api (user_email, photo_url, uploaded_at) VALUES (?, ?, ?)",
      [user_email, photoUrl, uploadedAt]
    );
    console.log(`✅ [DB 저장 완료] 반영된 행 수: ${result.affectedRows}`);

    res.json({ success: true, photoUrl, uploaded_at: uploadedAt });
  } catch (error) {
    console.error("❌ 사진 업로드 오류:", error);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
});

// ✅ 3. 사진 삭제 API
app.delete("/api/photos/delete-by-date/:email/:date", async (req, res) => {
  const { email, date } = req.params;

  try {
    console.log(`🚀 [삭제 요청] 이메일: ${email}, 날짜: ${date}`);

    // ✅ MySQL에서 삭제 쿼리 실행
    const result = await db.query(
      "DELETE FROM kmg_api WHERE user_email = ? AND DATE(uploaded_at) = ?",
      [email, date]
    );

    if (result[0].affectedRows > 0) {
      console.log(`✅ 삭제 완료: ${date}의 사진 삭제됨`);
      return res.json({ success: true, message: "사진 삭제 완료" });
    } else {
      console.log("❌ 삭제할 사진 없음");
      return res.status(404).json({ success: false, message: "삭제할 사진이 없습니다." });
    }
  } catch (error) {
    console.error("❌ 사진 삭제 오류:", error);
    return res.status(500).json({ success: false, message: "서버 오류" });
  }
}); 

// ✅ 4. 특정 날짜별 사진 조회 API
// ✅ 특정 날짜 또는 전체 사진 조회 API
app.get("/api/photos/by-date/:user_email/:date", async (req, res) => {
  const { user_email, date } = req.params;

  try {
    let query;
    let values;

    if (date === "all") {
      // ✅ 전체 사진 조회
      query = "SELECT * FROM kmg_api WHERE user_email = ?";
      values = [user_email];
    } else {
      // ✅ 특정 날짜 사진 조회
      query = "SELECT * FROM kmg_api WHERE user_email = ? AND DATE(uploaded_at) = ?";
      values = [user_email, date];
    }

    const [rows] = await db.query(query, values);
    res.json(rows);
  } catch (error) {
    console.error("사진 조회 오류:", error);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
});


// 서버 실행
app.listen(5002, () => {
  console.log(`서버 실행 중: http://localhost:5002`);
});