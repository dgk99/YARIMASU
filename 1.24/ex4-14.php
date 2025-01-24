<?php
    // 연관 배열 요소의 키와 값 추출하기

    $member = array("id" => "hong77", "pass" => "12345", "name" => "홍길동", "age" => 30);

    foreach($member as $key => $value){
        echo "키 : ".$key.", 값 : ".$value;
        echo "<br>";
    }
?>