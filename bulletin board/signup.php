<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") { 
    $user_id = $_POST["user_id"]; 
    $user_pass = $_POST["user_pass"]; 
    $user_name = $_POST["user_name"]; 
    $user_birth = $_POST["user_birth"]; 
    $user_gender = $_POST["user_gender"]; 

    // 비밀번호 암호화 (보안을 위해 반드시 필요)
    $hashed_pass = password_hash($user_pass, PASSWORD_DEFAULT); 

    // 네트워크 연결결
    $host = 'localhost';
    $user = 'kmg';
    $password = '12345';
    $database = 'yarimasu';

    // 2. 데이터베이스 연결
    $conn = new mysqli($host, $user, $password, $database);

    if ($conn->connect_error) { 
        die("데이터베이스 연결 실패: " . $conn->connect_error);
    }

    // 아이디 중복 체크
    $check_sql = "SELECT * FROM kmg_user_table WHERE user_id='$user_id'";
    $check_result = $conn->query($check_sql);

    if (!$check_result) {
        die("SQL 실행 오류: " . $conn->error);
    }

    if ($check_result->num_rows > 0) {
        echo "이미 존재하는 아이디입니다.";
        $conn->close();
        exit();
    }

    // 중복 아이디가 없으면 회원가입 진행
    $stmt = $conn->prepare("INSERT INTO kmg_user_table (user_id, user_pass, user_name, user_birth, user_gender) 
                            VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $user_id, $hashed_pass, $user_name, $user_birth, $user_gender);

    if ($stmt->execute()) { 
        // 회원가입 성공 후 바로 로그인 페이지로 이동
        header("Location: login.html");
        exit(); // 추가: exit()으로 이후 코드 실행을 막음
    } else {
        echo "회원가입 실패: " . $conn->error;
    }

    $stmt->close();
    $conn->close();
}
?>
