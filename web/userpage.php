<?php
session_start();

// 로그아웃 처리
if (isset($_POST['logout'])) {
    session_destroy(); // 세션 종료
    header("Location: login.html"); // 로그인 페이지로 리다이렉트
    exit();
}

// DB 연결
$host = 'localhost';
$user = 'kmg';
$password = '12345';
$database = 'yarimasu';
$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die("데이터베이스 연결 실패: " . $conn->connect_error);
}

// 사용자 정보 가져오기
$회원번호 = $_SESSION['회원번호'];
$stmt = $conn->prepare("SELECT 이름, 나이, 성별, 키 FROM kmg_table WHERE 회원번호 = ?");
$stmt->bind_param("i", $회원번호);
$stmt->execute();
$stmt->bind_result($이름, $나이, $성별, $키);
$stmt->fetch();
$stmt->close();
$conn->close();
?>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>내 정보</title>
</head>
<body>
    <h2>내 정보</h2>
    <p>이름: <?php echo $이름; ?></p>
    <p>나이: <?php echo $나이; ?></p>
    <p>성별: <?php echo $성별; ?></p>
    <p>키: <?php echo $키; ?>cm</p>


    <!-- 회원 정보 수정 버튼 -->
    <a href="edit_profile.php">
        <button type="button">회원 정보 수정</button>
    </a>

    <form action="userpage.php" method="POST">
        <button type="submit" name="logout">로그아웃</button>
    </form>

        <!-- 회원 탈퇴 버튼 (JavaScript 확인창 추가) -->
        <button type="button" onclick="confirmDelete()">회원 탈퇴</button>

    <script>
        function confirmDelete() {
            if (confirm("정말로 회원 탈퇴를 하시겠습니까? 탈퇴 후에는 복구할 수 없습니다.")) {
                location.href = 'delete_account.php';
            }
        }
    </script>

</body>
</html>
