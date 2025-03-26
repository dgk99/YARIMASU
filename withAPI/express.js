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
    // ✅ 1. Google 사용자 정보 요청
    const userInfoResponse = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`);
    const userInfo = await userInfoResponse.json();
    const userEmail = userInfo.email;

    console.log("✅ Google 사용자 정보:", userInfo);

    // ✅ 2. kmg_api 테이블에 사진은 업로드할 때만 저장. 여기서는 안 저장함.
    // (회원 여부 확인만 하고 아무 작업 안 함)
    const [rows] = await db.query("SELECT 1 FROM kmg_api WHERE user_email = ? LIMIT 1", [userEmail]);

    // ✅ 3. 대표 사진 가져오기 (있을 경우만)
    let fixedPhoto = "";
    const [firstPhoto] = await db.query(
      "SELECT photo_url FROM kmg_api WHERE user_email = ? AND is_first = 1 LIMIT 1",
      [userEmail]
    );
    if (firstPhoto.length > 0) {
      fixedPhoto = firstPhoto[0].photo_url;
    }

    // ✅ 4. 프론트로 응답
    res.json({ email: userEmail}); // ← 대표 사진만 넘김

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

    // ✅ 대표 사진 존재 여부 확인
    const [existingFirstPhoto] = await db.query(
      "SELECT 1 FROM kmg_api WHERE user_email = ? AND is_first = 1 LIMIT 1",
      [user_email]
    );

    const isFirst = existingFirstPhoto.length === 0 ? 1 : 0;

    // ✅ 사진 저장
    const [result] = await db.query(
      "INSERT INTO kmg_api (user_email, photo_url, is_first, uploaded_at) VALUES (?, ?, ?, ?)",
      [user_email, photoUrl, isFirst, uploadedAt]
    );

    console.log(`✅ [DB 저장 완료] is_first=${isFirst}, 반영된 행 수: ${result.affectedRows}`);

    res.json({ success: true, photoUrl, uploaded_at: uploadedAt, is_first: isFirst });
  } catch (error) {
    console.error("❌ 사진 업로드 오류:", error);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
});

// ✅ 처음 찍은 사진 등록용
app.post("/api/photos/first", upload.single("photo"), async (req, res) => {
  const { user_email } = req.body;
  const photoUrl = `/uploads/${req.file.filename}`;
  const uploadedAt = moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");

  try {
    // 기존 대표 사진 삭제 (중복 방지)
    await db.query("DELETE FROM kmg_api WHERE user_email = ? AND is_first = 1", [user_email]);

    const [result] = await db.query(
      "INSERT INTO kmg_api (user_email, photo_url, is_first, uploaded_at) VALUES (?, ?, 1, ?)",
      [user_email, photoUrl, uploadedAt]
    );

    res.json({ success: true, photoUrl, uploaded_at: uploadedAt });
  } catch (error) {
    console.error("대표 사진 업로드 오류:", error);
    res.status(500).json({ success: false, message: "대표 사진 등록 실패" });
  }
});

// ✅ 3. 사진 삭제 API
app.delete("/api/photos/delete-by-date/:email/:date", async (req, res) => {
  const { email, date } = req.params;

  try {
    console.log(`🚀 [삭제 요청] 이메일: ${email}, 날짜: ${date}`);
    
    // 날짜와 is_first 모두 정확하게 조건 걸기
    const result = await db.query(
      `DELETE FROM kmg_api 
      WHERE user_email = ? 
      AND is_first = 0 
      AND DATE_FORMAT(uploaded_at, '%Y-%m-%d') = ?`,  // 날짜만 비교
      [email, date]
    );

    if (result[0].affectedRows > 0) {
      console.log(`✅ 삭제 완료: ${date}의 일반 사진 삭제됨`);
      return res.json({ success: true, message: "일반 사진 삭제 완료" });
    } else {
      console.log("❌ 삭제할 일반 사진 없음");
      return res.status(404).json({ success: false, message: "삭제할 일반 사진이 없습니다." });
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

app.get("/api/user/first-photo/:email", async (req, res) => {
  const { email } = req.params;
  const [rows] = await db.query(
    "SELECT photo_url FROM kmg_api WHERE user_email = ? AND is_first = 1 LIMIT 1",
    [email]
  );

  if (rows.length > 0) {
    res.json({ photoUrl: rows[0].photo_url });
  } else {
    res.status(404).json({ message: "대표 사진 없음" });
  }
});

// ✅ 회원 탈퇴 API
app.delete("/api/user/delete/:email", async (req, res) => {
  const { email } = req.params;

  try {
    // 사용자의 모든 데이터 삭제 (사진 포함)
    const [result] = await db.query("DELETE FROM kmg_api WHERE user_email = ?", [email]);

    if (result.affectedRows > 0) {
      console.log(`✅ 회원 탈퇴 완료: ${email}`);
      res.json({ success: true, message: "회원 탈퇴 완료" });
    } else {
      console.log(`❌ 탈퇴할 데이터 없음: ${email}`);
      res.status(404).json({ success: false, message: "해당 사용자가 존재하지 않습니다." });
    }
  } catch (error) {
    console.error("❌ 회원 탈퇴 오류:", error);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
});

// 서버 실행
app.listen(5002, () => {
  console.log(`서버 실행 중: http://localhost:5002`);
});