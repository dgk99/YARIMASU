<?php
session_start();

// 로그인 여부 확인
if (!isset($_SESSION['회원번호'])) {
    echo "로그인이 필요합니다. <a href='login.html'>로그인</a>";
    exit();
}

// 데이터베이스 연결
$host = 'localhost';
$user = 'kmg';
$password = '12345';
$database = 'yarimasu';
$conn = new mysqli($host, $user, $password, $database);

// 연결 체크
if ($conn->connect_error) {
    die("데이터베이스 연결 실패: " . $conn->connect_error);
}

// 현재 로그인한 회원번호 가져오기
$회원번호 = $_SESSION['회원번호'];

// 회원 정보 삭제 (DB에서 삭제)
$query = "DELETE FROM kmg_table WHERE 회원번호 = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $회원번호);

if ($stmt->execute()) {
    // 회원 탈퇴 성공 → 세션 삭제 및 로그인 페이지로 이동
    session_destroy();
    echo "회원 탈퇴가 완료되었습니다. 3초 후 로그인 페이지로 이동합니다.";
    header("refresh:3;url=login.html");
    exit();
} else {
    echo "회원 탈퇴 중 오류가 발생했습니다: " . $conn->error;
}

$stmt->close();
$conn->close();
?>
