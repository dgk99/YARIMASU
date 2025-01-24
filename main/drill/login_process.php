<?php
// MySQL 연결
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "test_database";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("MySQL 연결 실패: " . $conn->connect_error);
}

// 폼 데이터 받기
$userId = $_POST['username'];
$userPassword = $_POST['password'];

// 데이터베이스에서 사용자 조회
$sql = "SELECT * FROM users WHERE username = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $userId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    
    // 비밀번호 검증
    if (password_verify($userPassword, $row['password'])) {
        // 로그인 성공
        session_start();
        $_SESSION['username'] = $row['username'];
        $_SESSION['name'] = $row['name'];
        header("Location: user_page.html"); // 성공 시 이동할 페이지
        exit;
    } else {
        echo "비밀번호가 일치하지 않습니다.";
    }
} else {
    echo "해당 아이디가 존재하지 않습니다.";
}

$stmt->close();
$conn->close();
?>
