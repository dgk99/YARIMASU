<?php
// 자격증 시험에서 필기 점수와 실기 점수가 모두 70점 이상이어야 합격인 경우를 만들어보기

    $test1 = 60;
    $test2 = 70;
    $result = "fail";

    if ($test1 >= 70 and $test2 >= 70){
        $result = "pass";
    }

    echo "필기 시험 점수 : ".$test1."점<br>";
    echo "실기 시험 점수 : ".$test2."점<br>";
    echo "시험 결과 : ".$result;
?>