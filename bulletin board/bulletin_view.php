<?php

include 'db_connect.php';


$post_id = $_GET['id'];


$sql = "SELECT * FROM kmg_bulletin_table WHERE post_id = $post_id"; 
$result = $conn->query($sql); 


if ($result->num_rows > 0) {
    $row = $result->fetch_assoc(); 

    echo "<h2>" . $row["title"] . "</h2>"; 
    echo "<p>작성자: " . $row["author"] . "</p>"; 
    echo "<p>작성일: " . $row["created_at"] . "</p>"; 
    echo "<p>" . $row["content"] . "</p>"; 
} else {
    echo "<p>게시글을 찾을 수 없습니다.</p>"; 
}


if ($_SESSION["user_id"] == $row["author"] || $_SESSION["user_role"] == "admin") {
    echo "<a href='edit_post.php?id=" . $row["post_id"] . "'>수정하기</a>";
}


if ($_SESSION["user_id"] == $row["author"] || $_SESSION["user_role"] == "admin") {
    echo "<a href='delete_post.php?id=" . $row["post_id"] . "'>삭제하기</a>";
}

$conn->close();
?>


<button onclick="location.href='bulletin.php'">목록</button> 
