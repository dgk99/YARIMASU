<?php
    // 1. MySQL 연결
    $conn = new mysqli('localhost', 'user', '12345', 'sample');
    if($conn->connect_error){
        die("연결에 실패했습니다. : " . $conn->connect_error);
    }

    // 2. 로그인 처리
    if ($_SERVER['REQUEST_METHOD'] === 'POST'){
        $학번 = $_POST['학번'];

    // 학번 확인
    $stmt = $conn->prepare("SELECT 이름 FROM client WHERE 학번 = ?");
    $stmt->bind_param("i", $학번);
    $stmt->execute();
    $stmt->bind_result($이름);
    if ($stmt->fetch()) {
        echo "로그인 성공! 환영합니다, $이름.";
    } else {
        echo "학번이 유효하지 않습니다.";
    }
    $stmt->close();

}
$conn->close();

?>
