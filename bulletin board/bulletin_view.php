<?php
session_start(); // 세션 시작

// 로그인 확인: 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트
if (!isset($_SESSION["user_id"])) {
    header("Location: login.html"); // 로그인 페이지로 이동
    exit();
}

// 데이터베이스 연결
$host = 'localhost'; // DB 서버 주소
$user = 'kmg'; // DB 사용자명
$password = '12345'; // DB 비밀번호
$database = 'yarimasu'; // 사용할 데이터베이스 이름

$conn = new mysqli($host, $user, $password, $database);
if ($conn->connect_error) {
    die("데이터베이스 연결 실패: " . $conn->connect_error); // 연결 오류 시 메시지 출력
}

// URL에서 게시글 ID를 가져오기
$post_id = $_GET['id']; // URL에서 게시글 ID를 받아옴 (예: 'bulletin_view.php?id=1')

// 게시글 상세 조회
$sql = "SELECT * FROM kmg_bulletin_table WHERE post_id = $post_id"; 
$result = $conn->query($sql); 

// 게시글이 존재하는지 확인
if ($result->num_rows > 0) {
    $row = $result->fetch_assoc(); // 게시글 데이터 가져오기
    // 게시글 내용 출력
    echo "<h2>" . $row["title"] . "</h2>"; // 제목 출력
    echo "<p>작성자: " . $row["author"] . "</p>"; // 작성자 출력
    echo "<p>작성일: " . $row["created_at"] . "</p>"; // 작성 날짜 출력
    echo "<p>" . $row["content"] . "</p>"; // 내용 출력
} else {
    echo "<p>게시글을 찾을 수 없습니다.</p>"; // 게시글이 없을 경우 메시지 출력
}

// 작성자가 본인의 게시글을 수정할 수 있도록 수정 버튼 추가
if ($_SESSION["user_id"] == $row["author"] || $_SESSION["user_role"] == "admin") {
    echo "<a href='edit_post.php?id=" . $row["post_id"] . "'>수정하기</a>";
}

// 작성자 또는 관리자인 경우에만 삭제 버튼 표시
if ($_SESSION["user_id"] == $row["author"] || $_SESSION["user_role"] == "admin") {
    echo "<a href='delete_post.php?id=" . $row["post_id"] . "'>삭제하기</a>";
}

$conn->close(); // 데이터베이스 연결 종료
?>

<!-- 게시판 목록으로 돌아가는 버튼 -->
<button onclick="location.href='bulletin.php'">목록</button> <!-- 클릭 시 게시판 목록으로 돌아감 -->
