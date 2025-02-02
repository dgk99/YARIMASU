<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $user_id = $_POST["user_id"];
    $user_pass = $_POST["user_pass"];

    $host = 'localhost';
    $user = 'kmg';
    $password = '12345';
    $database = 'yarimasu';

    $conn = new mysqli($host, $user, $password, $database);
    if ($conn->connect_error) {
        die("데이터베이스 연결 실패: " . $conn->connect_error);
    }

    $sql = "SELECT * FROM kmg_user_table WHERE user_id = '$user_id'";
    $result = $conn->query($sql);

    if ($result->num_rows == 1) {
        $row = $result->fetch_assoc();

        if (password_verify($user_pass, $row["user_pass"])) {
            $_SESSION["user_id"] = $row["user_id"];
            $_SESSION["user_role"] = $row["user_role"]; // 관리자 권한 저장

            header("Location: bulletin.php");
            exit();
        } else {
            echo "비밀번호가 일치하지 않습니다.";
        }
    } else {
        echo "존재하지 않는 아이디입니다.";
    }

    $conn->close();
}
?>
