<?php
session_start(); // 세션 시작

// 1. MySQL 연결
$host = 'localhost';
$user = 'kmg';
$password = '12345';
$database = 'yarimasu';

$conn = new mysqli($host, $user, $password, $database);
if ($conn->connect_error) {
    die("연결 실패: " . $conn->connect_error);
}

// 2. 로그인 처리
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $회원번호 = $_POST['회원번호'];

    // 데이터베이스에서 회원번호 확인
    $stmt = $conn->prepare("SELECT 이름, 나이, 성별, 키 FROM kmg_table WHERE 회원번호 = ?");
    $stmt->bind_param("i", $회원번호);
    $stmt->execute();
    $stmt->bind_result($이름, $나이, $성별, $키);

    if ($stmt->fetch()) {
        // 로그인 성공 -> 세션에 사용자 정보 저장
        $_SESSION['회원번호'] = $회원번호;
        $_SESSION['이름'] = $이름;
        $_SESSION['나이'] = $나이;
        $_SESSION['성별'] = $성별;
        $_SESSION['키'] = $키;

        // 사용자 페이지로 리다이렉트
        header("Location: userpage.php");
        exit();
    } else {
        // 로그인 실패
        echo "회원번호가 유효하지 않습니다. 로그인 화면으로 돌아갑니다.";
        // 1초 후 로그인 화면으로 복귀귀
        header("refresh:1;url=login.html");
    }

    $stmt->close();
}
$conn->close();
?>
