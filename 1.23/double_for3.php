<?php
// 숫자로 삼각형 만들기

    // for ($i = 1; $i <= 9; $i++){
    //     for ($j = 1; $j <= $i; $j++){
    //         echo $i;
    //     }
    //     echo "<br>";
    // }

// 역삼각형 만들기

    for ($i = 9; $i >= 1; $i--){
        for ($j = 1; $j <= $i; $j++){
            echo $i;
        }
        echo "<br>";
    }
?>