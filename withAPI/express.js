require("dotenv").config();
const express = require("express");
const mysql = require("mysql2/promise");
const { OAuth2Client } = require("google-auth-library");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");

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

// app.listen(5002, () => {
//   console.log("Server running on port 5002");
// });

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
app.post("/api/auth/google", async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ success: false, message: "ID 토큰 없음" });
  }

  try {
    // Google ID 토큰 검증
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const userEmail = payload.email;
    const userName = payload.name || "Unknown"; // 기본 값 설정
    const photoUrl = payload.picture || "";

    // ✅ 1. 기존 회원 여부 확인 (`kmg_api` 테이블만 사용)
    const [rows] = await db.query("SELECT * FROM kmg_api WHERE user_email = ?", [userEmail]);

    if (rows.length === 0) {
      // ✅ 2. 회원이 없으면 자동 추가 (is_first = 1)
      await db.query(
        "INSERT INTO kmg_api (user_email, photo_url, is_first) VALUES (?, ?, 1)",
        [userEmail, photoUrl]
      );
      return res.json({ email: userEmail, name: userName, photoUrl, isMember: false });
    }

    // ✅ 3. 기존 회원이면 정보 반환
    res.json({ email: userEmail, name: userName, photoUrl, isMember: true });

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

  try {
    await db.query(
      "INSERT INTO kmg_api (user_email, photo_url) VALUES (?, ?)",
      [user_email, photoUrl]
    );
    res.json({ success: true, photoUrl });
  } catch (error) {
    console.error("사진 업로드 오류:", error);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
});

// ✅ 3. 사진 삭제 API
app.delete("/api/photos/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM kmg_api WHERE id = ?", [id]);
    res.json({ success: true, message: "사진 삭제 완료" });
  } catch (error) {
    console.error("사진 삭제 오류:", error);
    res.status(500).json({ success: false, message: "서버 오류" });
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