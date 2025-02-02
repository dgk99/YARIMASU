<?php
session_start(); // 세션을 시작하여 로그인 상태 확인
date_default_timezone_set('Asia/Seoul');

// 로그인 확인: 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트
if (!isset($_SESSION["user_id"])) { 
    header("Location: login.html"); // 로그인 페이지로 이동
    exit(); // 코드 실행 종료
}

// 데이터베이스 연결
$host = 'localhost'; // 데이터베이스 서버 주소 (예: 'localhost' 또는 '127.0.0.1')
$user = 'kmg'; // 데이터베이스 사용자명 (예: 'root' 또는 'kmg')
$password = '12345'; // 데이터베이스 비밀번호 (예: '12345')
$database = 'yarimasu'; // 데이터베이스 이름 (예: 'yarimasu')

// 데이터베이스 연결
$conn = new mysqli($host, $user, $password, $database);
if ($conn->connect_error) {
    die("데이터베이스 연결 실패: " . $conn->connect_error); // 연결 오류 시 메시지 출력
}

// 폼 데이터 처리: 제목과 내용을 POST 방식으로 받기
if ($_SERVER["REQUEST_METHOD"] == "POST") { 
    // 폼이 POST 방식으로 제출되었을 때만 실행
    
    $title = $_POST["title"]; // 제목 (폼에서 입력받은 제목을 받음)
    $content = $_POST["content"]; // 내용 (폼에서 입력받은 내용을 받음)
    $author = $_SESSION["user_id"]; // 작성자 (로그인한 사용자의 ID를 세션에서 가져옴)

    // 데이터베이스에 새 게시글 삽입
    $sql = "INSERT INTO kmg_bulletin_table (title, content, author, created_at) 
            VALUES ('$title', '$content', '$author', NOW())"; 
    // 'title', 'content', 'author', 'created_at'은 데이터베이스의 컬럼 이름

    if ($conn->query($sql) === TRUE) {
        // 게시글 삽입 성공 시 게시글 목록 페이지로 리다이렉트
        header("Location: bulletin.php"); // 게시글 목록 페이지로 이동
        exit(); // 코드 실행 종료
    } else {
        echo "오류 발생: " . $conn->error; // 오류 메시지 출력
    }
}
?>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>글쓰기</title> <!-- 페이지 제목 부분 -->
</head>
<body>

    <h2>새 게시글 작성</h2>

    <!-- 게시글 작성 폼 -->
    <form action="write_post.php" method="POST">
        <label for="title">제목:</label> <!-- 제목을 입력받는 라벨 -->
        <input type="text" id="title" name="title" required> <!-- 제목 입력 필드 -->

        <br><br> <!-- 줄바꿈 -->

        <label for="content">내용:</label><br> <!-- 내용 입력을 위한 라벨 -->
        <textarea id="content" name="content" rows="10" cols="50" required></textarea><br><br> <!-- 내용 입력 필드 -->

        <button type="submit">작성하기</button> <!-- 제출 버튼 -->
    </form>

</body>
</html>
