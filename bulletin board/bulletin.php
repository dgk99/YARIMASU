<?php

include 'db_connect.php';

// 로그아웃 처리
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["logout"])) {
    session_unset();
    session_destroy();
    header("Location: login.html");
    exit();
}



// 게시글 목록을 가져오는 SQL 쿼리
$sql = "SELECT *, 
        (SELECT COUNT(*) FROM kmg_bulletin_table AS t2 WHERE t2.created_at <= t1.created_at) AS 순번
        FROM kmg_bulletin_table AS t1
        ORDER BY created_at DESC";

$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>게시판 목록</title>
</head>
<body>

    <h2>게시판 목록</h2>

    <form action="" method="POST">
        <button type="submit" name="logout">로그아웃</button>
    </form>

    <?php if ($result->num_rows > 0): ?>
        <table border="1">
            <tr>
                <th>순번</th>
                <th>제목</th>
                <th>작성자</th>
                <th>작성 날짜</th>
            </tr>

            <?php
            while($row = $result->fetch_assoc()) {
                echo "<tr>";
                echo "<td>" . $row["순번"] . "</td>";
                echo "<td><a href='bulletin_view.php?id=" . $row["post_id"] . "'>" . $row["title"] . "</a></td>";
                echo "<td>" . $row["author"] . "</td>";
                echo "<td>" . $row["created_at"] . "</td>";
                echo "</tr>";
            }
            ?>

        </table>
    <?php else: ?>
        <p>게시글이 없습니다.</p>
    <?php endif; ?>

    <button onclick="location.href='write_post.php'">글쓰기</button>

</body>
</html>

<?php
$conn->close();
?>
