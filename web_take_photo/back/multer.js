const multer = require("multer");
const path = require("path");

// 업로드 폴더 설정
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

module.exports = upload;