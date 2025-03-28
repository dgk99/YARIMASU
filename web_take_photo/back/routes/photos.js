const express = require("express");
const router = express.Router();
const db = require("../db");
const upload = require("../multer");
const moment = require("moment-timezone");

// ✅ 일반 사진 업로드
router.post("/add", upload.single("photo"), async (req, res) => {
  const { user_email } = req.body;
  const photoUrl = `/uploads/${req.file.filename}`;
  const uploadedAt = moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");

  try {
    const [existingFirstPhoto] = await db.query(
      "SELECT 1 FROM kmg_api WHERE user_email = ? AND is_first = 1 LIMIT 1",
      [user_email]
    );
    const isFirst = existingFirstPhoto.length === 0 ? 1 : 0;

    const [result] = await db.query(
      "INSERT INTO kmg_api (user_email, photo_url, is_first, uploaded_at) VALUES (?, ?, ?, ?)",
      [user_email, photoUrl, isFirst, uploadedAt]
    );

    res.json({ success: true, photoUrl, uploaded_at: uploadedAt, is_first: isFirst });
  } catch (error) {
    console.error("❌ 사진 업로드 오류:", error);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
});

// ✅ 대표 사진 업로드
router.post("/first", upload.single("photo"), async (req, res) => {
  const { user_email } = req.body;
  const photoUrl = `/uploads/${req.file.filename}`;
  const uploadedAt = moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");

  try {
    await db.query("DELETE FROM kmg_api WHERE user_email = ? AND is_first = 1", [user_email]);

    await db.query(
      "INSERT INTO kmg_api (user_email, photo_url, is_first, uploaded_at) VALUES (?, ?, 1, ?)",
      [user_email, photoUrl, uploadedAt]
    );

    res.json({ success: true, photoUrl, uploaded_at: uploadedAt });
  } catch (error) {
    console.error("대표 사진 업로드 오류:", error);
    res.status(500).json({ success: false, message: "대표 사진 등록 실패" });
  }
});

// ✅ 날짜별 일반 사진 삭제
router.delete("/delete-by-date/:email/:date", async (req, res) => {
  const { email, date } = req.params;

  try {
    const result = await db.query(
      `DELETE FROM kmg_api 
       WHERE user_email = ? 
       AND is_first = 0 
       AND DATE_FORMAT(uploaded_at, '%Y-%m-%d') = ?`,
      [email, date]
    );

    if (result[0].affectedRows > 0) {
      return res.json({ success: true, message: "일반 사진 삭제 완료" });
    } else {
      return res.status(404).json({ success: false, message: "삭제할 일반 사진이 없습니다." });
    }
  } catch (error) {
    console.error("❌ 사진 삭제 오류:", error);
    return res.status(500).json({ success: false, message: "서버 오류" });
  }
});

// ✅ 날짜별 또는 전체 사진 조회
router.get("/by-date/:user_email/:date", async (req, res) => {
  const { user_email, date } = req.params;

  try {
    let query;
    let values;

    if (date === "all") {
      query = "SELECT * FROM kmg_api WHERE user_email = ?";
      values = [user_email];
    } else {
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

module.exports = router;