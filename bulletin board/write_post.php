<?php

include 'db_connect.php';


if ($_SERVER["REQUEST_METHOD"] == "POST") { 

    
    $title = $_POST["title"]; 
    $content = $_POST["content"]; 
    $author = $_SESSION["user_id"];


    $sql = "INSERT INTO kmg_bulletin_table (title, content, author, created_at) 
            VALUES ('$title', '$content', '$author', NOW())"; 


    if ($conn->query($sql) === TRUE) {
 
        header("Location: bulletin.php"); 
        exit(); 
    } else {
        echo "오류 발생: " . $conn->error; 
    }
}
?>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>글쓰기</title> 
</head>
<body>

    <h2>새 게시글 작성</h2>


    <form action="write_post.php" method="POST">
        <label for="title">제목:</label> 
        <input type="text" id="title" name="title" required>

        <br><br>

        <label for="content">내용:</label><br>
        <textarea id="content" name="content" rows="10" cols="50" required></textarea><br><br> <!-- 내용 입력 필드 -->

        <button type="submit">작성하기</button> 
    </form>

</body>
</html>
