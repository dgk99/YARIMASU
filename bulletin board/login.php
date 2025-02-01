<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") { 
    // 1. 데이터가 POST로 제대로 전송되었는지 확인
    if (isset($_POST["user_id"]) && isset($_POST["user_pass"])) {
        $user_id = $_POST["user_id"];
        $user_pass = $_POST["user_pass"];
    } else {
        echo "아이디나 비밀번호가 비어 있습니다!";
        exit();
    }

    // 2. 데이터베이스 연결
    $conn = new mysqli("localhost", "kmg", "12345", "yarimasu");

    if ($conn->connect_error) { 
        die("데이터베이스 연결 실패: " . $conn->connect_error); 
    }

    // 3. 아이디가 DB에 있는지 확인
    $sql = "SELECT * FROM kmg_user_table WHERE user_id='$user_id'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) { 
        // 4. 아이디가 존재하면 비밀번호 확인
        $row = $result->fetch_assoc();
        if (password_verify($user_pass, $row["user_pass"])) {
            $_SESSION["user_id"] = $row["user_id"];
            $_SESSION["user_name"] = $row["user_name"];
            header("Location: index.php"); // 로그인 성공 후 메인 페이지로 이동
            exit();
        } else {
            echo "비밀번호가 올바르지 않습니다.";
        }
    } else {
        echo "존재하지 않는 아이디입니다.";
    }

    $conn->close();
}
?>
