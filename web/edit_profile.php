<?php
session_start();

// 로그인 여부 확인 (세션이 없으면 로그인 페이지로 이동)
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

// 연결 오류 체크
if ($conn->connect_error) {
    die("데이터베이스 연결 실패: " . $conn->connect_error);
}

// 현재 로그인한 사용자의 회원번호 가져오기
$회원번호 = $_SESSION['회원번호'];

// 사용자의 기존 정보 불러오기
$stmt = $conn->prepare("SELECT 이름, 나이, 성별, 키 FROM kmg_table WHERE 회원번호 = ?");
$stmt->bind_param("i", $회원번호);
$stmt->execute();
$stmt->bind_result($이름, $나이, $성별, $키);
$stmt->fetch();
$stmt->close();

// 사용자가 수정 버튼을 눌렀을 때 (POST 요청이 들어왔을 때)
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $이름 = trim($_POST['이름']);
    $나이 = trim($_POST['나이']);
    $성별 = trim($_POST['성별']);
    $키 = trim($_POST['키']);

    // 입력값 검증 (빈 값 체크)
    if (empty($이름) || empty($나이) || empty($성별) || empty($키)) {
        echo "모든 필드를 입력해야 합니다. <a href='edit_profile.php'>돌아가기</a>";
        exit();
    }

    // 데이터베이스에 사용자 정보 업데이트
    $query = "UPDATE kmg_table SET 이름=?, 나이=?, 성별=?, 키=? WHERE 회원번호=?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("sisdi", $이름, $나이, $성별, $키, $회원번호);

    if ($stmt->execute()) {
        echo "정보가 성공적으로 수정되었습니다.";
        // 1초 후 유저 페이지로 이동
        header("refresh:1;url=userpage.php");
    } else {
        echo "오류 발생: " . $conn->error;
    }

    $stmt->close();
    $conn->close();
    exit();
}

$conn->close(); // 데이터베이스 연결 종료
?>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>회원 정보 수정</title>
</head>
<body>
    <h2>회원 정보 수정</h2>
    <form action="edit_profile.php" method="POST">
        <!-- 이름 입력 필드 -->
        <label for="이름">이름:</label>
        <input type="text" id="이름" name="이름" value="<?php echo htmlspecialchars($이름); ?>" required><br><br>

        <!-- 나이 입력 필드 -->
        <label for="나이">나이:</label>
        <input type="number" id="나이" name="나이" value="<?php echo htmlspecialchars($나이); ?>" required><br><br>

        <!-- 성별 선택 필드 -->
        <label for="성별">성별:</label>
        <select id="성별" name="성별">
            <option value="남자" <?php if ($성별 == "남자") echo "selected"; ?>>남자</option>
            <option value="여자" <?php if ($성별 == "여자") echo "selected"; ?>>여자</option>
            <option value="기타" <?php if ($성별 == "기타") echo "selected"; ?>>기타</option>
        </select><br><br>

        <!-- 키 입력 필드 -->
        <label for="키">키 (cm):</label>
        <input type="number" id="키" name="키" value="<?php echo htmlspecialchars($키); ?>" step="0.01"><br><br>

        <!-- 수정 버튼 -->
        <button type="submit">수정 완료</button>
    </form>

    <!-- 뒤로 가기 버튼 -->
    <a href="userpage.php">뒤로 가기</a>
</body>
</html>
