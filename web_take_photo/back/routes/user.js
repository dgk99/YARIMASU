const express = require("express");
const router = express.Router();
const db = require("../db");

// ✅ 대표 사진 조회 API
router.get("/first-photo/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT photo_url FROM kmg_api WHERE user_email = ? AND is_first = 1 LIMIT 1",
      [email]
    );

    if (rows.length > 0) {
      res.json({ photoUrl: rows[0].photo_url });
    } else {
      res.status(404).json({ message: "대표 사진 없음" });
    }
  } catch (err) {
    console.error("대표 사진 조회 오류:", err);
    res.status(500).json({ message: "서버 오류" });
  }
});

// ✅ 회원 탈퇴 API (사진 포함 전체 삭제)
router.delete("/delete/:email", async (req, res) => {
  const { email } = req.params;

  try {
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

module.exports = router;