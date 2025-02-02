<?php
session_start();

if (!isset($_SESSION["user_id"])) {
    header("Location: login.html");
    exit();
}

$host = 'localhost';
$user = 'kmg';
$password = '12345';
$database = 'yarimasu';

$conn = new mysqli($host, $user, $password, $database);
if ($conn->connect_error) {
    die("데이터베이스 연결 실패: " . $conn->connect_error);
}

if (!isset($_GET['id']) || empty($_GET['id'])) {
    die("잘못된 접근입니다.");
}

$post_id = intval($_GET['id']);

$sql = "SELECT * FROM kmg_bulletin_table WHERE post_id = $post_id"; 
$result = $conn->query($sql);
if ($result->num_rows == 0) {
    die("게시글을 찾을 수 없습니다.");
}

$row = $result->fetch_assoc();

if ($_SESSION["user_id"] != $row["author"] && $_SESSION["user_role"] != "admin") {
    die("삭제 권한이 없습니다.");
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if ($_SESSION["user_role"] == "admin") {
        $delete_sql = "DELETE FROM kmg_bulletin_table WHERE post_id = $post_id";
        if ($conn->query($delete_sql) === TRUE) {
            echo "<script>window.location.href='bulletin.php';</script>";
            exit();
        } else {
            die("삭제 오류: " . $conn->error);
        }
    } else {
        $password = $_POST["password"];
        $check_password_sql = "SELECT user_pass FROM kmg_user_table WHERE user_id = '" . $_SESSION["user_id"] . "'";
        $check_result = $conn->query($check_password_sql);
        $user_data = $check_result->fetch_assoc();

        if (password_verify($password, $user_data["user_pass"])) {
            $delete_sql = "DELETE FROM kmg_bulletin_table WHERE post_id = $post_id";
            if ($conn->query($delete_sql) === TRUE) {
                echo "<script>window.location.href='bulletin.php';</script>";
                exit();
            } else {
                die("삭제 오류: " . $conn->error);
            }
        } else {
            echo "<p>비밀번호가 일치하지 않습니다.</p>";
        }
    }
}
?>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>게시글 삭제</title>
</head>
<body>

<h2>게시글 삭제</h2>

<p>이 게시글을 삭제하시겠습니까?</p>

<form action="delete_post.php?id=<?php echo $post_id; ?>" method="POST">
    <?php if ($_SESSION["user_role"] != "admin"): ?>
        <label for="password">비밀번호:</label><br>
        <input type="password" name="password" required><br><br>
    <?php endif; ?>

    <button type="submit">삭제하기</button>
</form>

<a href="bulletin.php">취소</a>

</body>
</html>

<?php
$conn->close();
?>
