<?php

// 데이터베이스 연결 정보
$host = 'localhost';
$user = 'kmg';
$password = '12345';
$database = 'yarimasu';

// 데이터베이스 연결 설정
$conn = new mysqli($host, $user, $password, $database);

// 연결 오류 확인
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// POST 요청 처리
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 사용자 입력 값 가져오기
    $회원번호 = $_POST['회원번호'];
    $이름 = $_POST['이름'];
    $나이 = $_POST['나이'];
    $성별 = $_POST['성별'];
    $키 = $_POST['키'];

    // 데이터 삽입
    $stmt = $conn->prepare("INSERT INTO kmg_table (회원번호, 이름, 나이, 성별, 키) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("isisd", $회원번호, $이름, $나이, $성별, $키);

    if ($stmt->execute()) {
        echo "회원가입 성공! 3초 뒤 로그인 페이지로 이동합니다...";
        // 3초 후 리다이렉트
        header("refresh:3;url=login.html");
    } else {
        // Primary Key 중복 시 MySQL에서 반환하는 오류 처리
        if ($conn->errno === 1062) {
            echo "이미 사용 중인 회원번호입니다. 다른 회원번호를 사용해주세요.";
        } else {
            echo "회원가입 실패: " . $conn->error;
        }
    }

    $stmt->close();
}

$conn->close();
?>
