<?php
session_start(); // 세션 시작

// 로그인 확인: 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트
if (!isset($_SESSION["user_id"])) {
    header("Location: login.html");
    exit();
}

// 데이터베이스 연결
$host = 'localhost'; // DB 서버 주소
$user = 'kmg'; // DB 사용자명
$password = '12345'; // DB 비밀번호
$database = 'yarimasu'; // 사용할 데이터베이스 이름

$conn = new mysqli($host, $user, $password, $database);
if ($conn->connect_error) {
    die("데이터베이스 연결 실패: " . $conn->connect_error);
}

// 한국 시간 설정
date_default_timezone_set('Asia/Seoul');
?>
