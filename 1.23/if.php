<?php
// if문
// 지하철 기본 요금이 2500원이고, 경로 우대(65세 이상)인 경우 0원이 되는 조건문 만들기
    $age = 65;
    $pay = 2500;

    if ($age >= 65){
        $pay = 0;
    }

    echo "나이 : ".$age."세<br>";
    echo "요금 : ".$pay."원<br>";
    
?>