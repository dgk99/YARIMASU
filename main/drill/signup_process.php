<?php
// MySQL 데이터베이스 연결
$servername = "localhost";
$username = "root"; // 기본 MySQL 사용자
$password = ""; // 기본 비밀번호
$dbname = "test_database"; // 사용할 데이터베이스 이름

// 연결 시도
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("MySQL 연결 실패: " . $conn->connect_error);
} else {
    echo "MySQL 연결 성공!<br>"; // 연결 성공 확인
}

// 폼 데이터 받기
$user = $_POST['username'];
$pass = $_POST['password']; // 비밀번호는 암호화 전 값
$name = $_POST['name'];
$gender = $_POST['gender'];
$age = $_POST['age'];
$height = $_POST['height'];
$weight = $_POST['weight'];

// 비밀번호 암호화
$hashedPassword = password_hash($pass, PASSWORD_DEFAULT);

try {
    // Prepared Statement를 사용한 데이터 삽입
    $stmt = $conn->prepare("INSERT INTO users (username, password, name, gender, age, height, weight) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssidd", $user, $hashedPassword, $name, $gender, $age, $height, $weight);

    if ($stmt->execute()) {
        echo "회원가입 성공!<br>";
    } else {
        echo "쿼리 실행 실패: " . $stmt->error . "<br>"; // Prepared Statement 에러
    }

    $stmt->close();
} catch (Exception $e) {
    echo "오류 발생: " . $e->getMessage() . "<br>";
}

// 연결 종료
$conn->close();
?>
