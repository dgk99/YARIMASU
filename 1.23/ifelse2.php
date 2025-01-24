<?php
// 다이어트 프로그램
// 표준 체중 구하는 공식
// 표준 체중 = (키 - 100) x 0.9
    $weight = 70;
    $height = 200;
    $bar = ($height - 100) * 0.9;

    echo $bar."kg<br>";

    if ($weight > $bar){
        echo "다이어트가 필요";
    } else {
        echo "다이어트 안해도 무관";
    }
?>