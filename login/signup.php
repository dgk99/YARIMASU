<?php
// 데이터베이스 연결 설정
$conn = new mysqli('localhost', 'user', '12345', 'sample');

// 연결 오류 확인
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// POST 요청 처리
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 사용자 입력 값 가져오기
    $학번 = $_POST['학번'];
    $이름 = $_POST['이름'];
    $나이 = $_POST['나이'];
    $성별 = $_POST['성별'];
    $키 = $_POST['키'];

    // 학번 중복 확인
    $check_query = $conn->prepare("SELECT 학번 FROM client WHERE 학번 = ?");
    $check_query->bind_param("i", $학번);
    $check_query->execute();
    $check_query->store_result();

    if ($check_query->num_rows > 0) {
        echo "이미 사용 중인 학번입니다. 다른 학번을 사용해주세요.";
    } else {
        // 데이터 삽입
        $stmt = $conn->prepare("INSERT INTO client (학번, 이름, 나이, 성별, 키) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("isiss", $학번, $이름, $나이, $성별, $키);

        if ($stmt->execute()) {
            echo "회원가입 성공! 3초 뒤 로그인 페이지로 이동합니다...";
            // 3초 후 리다이렉트
            header("refresh:3;url=login.html");
        } else {
            echo "회원가입 실패: " . $conn->error;
        }
        $stmt->close();
    }
    $check_query->close();
}

$conn->close();
?>