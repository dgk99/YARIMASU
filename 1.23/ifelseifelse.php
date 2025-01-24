<?php
// 등급에 따른 점수 범위

    $score = 80;
    $grade = "";
    if ($score >= 90){
        $grade = "A";
    } else if ($score >= 85){
        $grade = "B+";
    } else {
        $grade = "F";
    }
    echo $grade;
?>