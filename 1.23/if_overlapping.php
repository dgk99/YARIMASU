<?php
// if중첩문
// 만 나이 계산하는 프로그램
// 출생월이 4월 이전(1 ~ 3월) 나이 = 현재년 - 출생년
// 출생월이 4월 
// 출생일이 15일이거나 그 이전(1 ~ 15일) 나이 = 현재년 - 출생년
// 출생일이 15일 이후 (16 ~ 31일) 나이 = 현재년 - 출생년 - 1
// 출생월이 4월 이후 나이 = 현재년 - 출생년 - 1

    $birth_yaer = 1999;
    $birth_month = 4;
    $birth_day = 8;

    $now_year = 2025;
    $now_month = 1;
    $now_day = 23;

    $age = 0;

    if ($birth_month < 4){
        $age = $now_year - $birth_yaer;
    } else if ($birth_month == 4){
        if ($birth_day >= 15){
            $age = $now_year - $birth_yaer - 1;
        } else {
            $age = $now_year - $birth_yaer;
        }
    } else {
        $age = $now_year - $birth_yaer - 1;
    }

    echo $age;

?>