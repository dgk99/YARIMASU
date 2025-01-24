<?php

// 1부터 10까지 출력하는 while문

    // $num = 1;

    // while($num < 11){
    //     echo $num."<br>";
    //     $num += 1;
    // }

// 1부터 100까지의 합을 구하는 while문
    // $num = 0;
    // $count = 0;
    // while($count < 101){
    //     $num += $count;
    //     $count += 1;
    // }
    // echo $num;

// 1에서 100까지의 수 중 5의 배수만 더하는 while문
    $num = 0;
    $count = 0;

    while($count <= 100){
        if ($count % 5 == 0){
            $num += $count;
        }
        $count += 1;
    }
    echo $num;
?>
