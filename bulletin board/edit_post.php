<?php
session_start();
date_default_timezone_set('Asia/Seoul');

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

$post_id = $_GET['id'];

$sql = "SELECT * FROM kmg_bulletin_table WHERE post_id = $post_id"; 
$result = $conn->query($sql);
$row = $result->fetch_assoc();

// 관리자도 수정 가능하도록 변경
if ($_SESSION["user_id"] != $row["author"] && $_SESSION["user_role"] != "admin") {
    echo "<p>수정 권한이 없습니다.</p>";
    exit();
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $new_title = $_POST["title"];
    $new_content = $_POST["content"];
    $password = $_POST["password"];

    if ($_SESSION["user_role"] != "admin") {
        $check_password_sql = "SELECT user_pass FROM kmg_user_table WHERE user_id = '" . $_SESSION["user_id"] . "'";
        $check_result = $conn->query($check_password_sql);
        $user_data = $check_result->fetch_assoc();

        if (password_verify($password, $user_data["user_pass"])) {
            $update_sql = "UPDATE kmg_bulletin_table 
                           SET title = '$new_title', 
                               content = '$new_content', 
                               created_at = NOW() 
                           WHERE post_id = $post_id";
            if ($conn->query($update_sql) === TRUE) {
                header("Location: bulletin.php");
                exit();
            } else {
                echo "오류 발생: " . $conn->error;
            }
        } else {
            echo "<p>비밀번호가 일치하지 않습니다.</p>";
        }
    } else {
        $update_sql = "UPDATE kmg_bulletin_table 
                       SET title = '$new_title', 
                           content = '$new_content', 
                           created_at = NOW() 
                       WHERE post_id = $post_id";
        if ($conn->query($update_sql) === TRUE) {
            header("Location: bulletin.php");
            exit();
        } else {
            echo "오류 발생: " . $conn->error;
        }
    }
}
?>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>게시글 수정</title>
</head>
<body>

<h2>게시글 수정</h2>

<form action="edit_post.php?id=<?php echo $post_id; ?>" method="POST">
    <label for="title">제목:</label><br>
    <input type="text" name="title" value="<?php echo $row['title']; ?>" required><br><br>

    <label for="content">내용:</label><br>
    <textarea name="content" rows="10" cols="50" required><?php echo $row['content']; ?></textarea><br><br>

    <?php if ($_SESSION["user_role"] != "admin"): ?>
        <label for="password">비밀번호:</label><br>
        <input type="password" name="password" required><br><br>
    <?php endif; ?>

    <button type="submit">수정하기</button>
</form>

</body>
</html>

<?php
$conn->close();
?>
