require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");


const app = express();
const secretKey = "your_secret_key";
const port = process.env.PORT || 5002;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// ✅ MySQL 연결
const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "1234",
  database: "yarimasu",
});

db.connect((err) => {
  if (err) console.error("MySQL 연결 오류:", err);
  else console.log("✅ MySQL 연결 성공!");
});


// 파일 업로드 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/';
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ 
  storage, 
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB 제한
});

// JWT 인증 미들웨어
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "로그인이 필요합니다." });

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).json({ message: "토큰이 유효하지 않습니다." });

    if (!user.id) {
      return res.status(401).json({ message: "잘못된 토큰입니다." });
    }

    req.user = user;
    next();
  });
};

// 로그인
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM kmg_users WHERE email = ?";

  db.query(sql, [email], async (err, result) => {
    if (err) return res.status(500).json({ message: "서버 오류" });
    if (result.length === 0) return res.status(401).json({ message: "이메일 또는 비밀번호가 틀렸습니다" });

    const user = result[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: "이메일 또는 비밀번호가 틀렸습니다" });

    const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: "1h" });
    res.json({ token });
  });
});

// 회원가입
app.post("/api/register", upload.single("firstPhoto"), async (req, res) => {
  const { email, password, name, birthdate, height, gender } = req.body;
  const firstPhoto = req.file ? req.file.filename : null; 
  
  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = `INSERT INTO kmg_users (email, password, name, birthdate, height, gender, first_photo)
               VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.query(sql, [email, hashedPassword, name, birthdate, height, gender, firstPhoto], (err) => {
    if (err) return res.status(500).json({ message: "회원가입 실패" });
    res.json({ message: "회원가입 성공!" });
  });
});

// 마이페이지 조회
app.get("/api/mypage", authenticateToken, (req, res) => {
  const userId = req.user.id; 

  const userQuery = "SELECT email, name, height, gender, DATE_FORMAT(birthdate, '%Y-%m-%d') AS birthdate, first_photo FROM kmg_users WHERE id = ?";
  
  db.query(userQuery, [userId], (err, result) => {
    if (err) {
      console.error("사용자 정보 조회 오류:", err);
      return res.status(500).json({ message: "서버 오류 (사용자 정보 조회 실패)" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    const user = result[0];

    // ✅ 사진 데이터 가져오기
    const photoQuery = "SELECT id, filename FROM kmg_photos WHERE user_id = ?";
    db.query(photoQuery, [userId], (err, photos) => {
      if (err) {
        console.error("사진 조회 오류:", err);
        return res.status(500).json({ message: "서버 오류 (사진 조회 실패)" });
      }

      // ✅ 최종 JSON 응답
      res.json({ ...user, photos });
    });
  });
});


// ✅ 사용자 정보 수정 API
app.put("/api/mypage/update", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { name, height } = req.body;

  const sql = "UPDATE kmg_users SET name = ?, height = ? WHERE id = ?";
  db.query(sql, [name, height, userId], (err) => {
    if (err) return res.status(500).json({ message: "정보 수정 실패" });

    res.json({ message: "정보가 수정되었습니다!" });
  });
});

// ✅ 사진 업로드 API
app.post("/api/mypage/upload", authenticateToken, upload.single("photo"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "파일이 업로드되지 않았습니다." });

  const userId = req.user.id;
  const filename = req.file.filename;

  const sql = "INSERT INTO kmg_photos (user_id, filename) VALUES (?, ?)";
  db.query(sql, [userId, filename], (err) => {
    if (err) return res.status(500).json({ message: "사진 업로드 실패" });

    res.json({ message: "사진 업로드 성공!" });
  });
});

// ✅ 사진 삭제 API
app.delete("/api/mypage/photo/:photoId", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const photoId = req.params.photoId;

  const sql = "SELECT filename FROM kmg_photos WHERE id = ? AND user_id = ?";
  db.query(sql, [photoId, userId], (err, result) => {
    if (err || result.length === 0) return res.status(404).json({ message: "사진을 찾을 수 없습니다." });

    const filename = result[0].filename;
    const filePath = path.join(__dirname, "uploads", filename);

    fs.unlink(filePath, (err) => {
      if (err) console.error("파일 삭제 오류:", err);
    });

    db.query("DELETE FROM kmg_photos WHERE id = ?", [photoId], (err) => {
      if (err) return res.status(500).json({ message: "사진 삭제 실패" });

      res.json({ message: "사진이 삭제되었습니다!" });
    });
  });
});

// ✅ 회원 탈퇴 API 추가
app.delete("/api/mypage/delete", authenticateToken, (req, res) => {
  const userId = req.user.id;

  // 1️⃣ 사용자 정보 삭제 전, 업로드된 파일 삭제
  const getPhotoQuery = "SELECT first_photo FROM kmg_users WHERE id = ?";
  db.query(getPhotoQuery, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: "서버 오류 (사진 조회 실패)" });

    if (results.length > 0 && results[0].first_photo) {
      const filePath = `uploads/${results[0].first_photo}`;
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath); // 파일 삭제
    }

    // 2️⃣ 사용자 업로드 사진 삭제
    const deletePhotosQuery = "SELECT filename FROM kmg_photos WHERE user_id = ?";
    db.query(deletePhotosQuery, [userId], (err, photos) => {
      if (err) return res.status(500).json({ message: "서버 오류 (사진 삭제 실패)" });

      photos.forEach(photo => {
        const filePath = `uploads/${photo.filename}`;
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });

      // 3️⃣ 사진 DB에서 삭제
      db.query("DELETE FROM kmg_photos WHERE user_id = ?", [userId], (err) => {
        if (err) return res.status(500).json({ message: "서버 오류 (사진 DB 삭제 실패)" });

        // 4️⃣ 사용자 정보 삭제
        db.query("DELETE FROM kmg_users WHERE id = ?", [userId], (err) => {
          if (err) return res.status(500).json({ message: "서버 오류 (회원 삭제 실패)" });

          res.json({ message: "회원 탈퇴 완료" });
        });
      });
    });
  });
});


// 서버 실행
app.listen(port, '0.0.0.0', () => {
  console.log(`서버가 http://0.0.0.0:${port} 에서 실행 중`);
});
