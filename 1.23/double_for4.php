<?php
// 역 삼각형 별 만들기

    for ($i = 1; $i <= 9; $i++){
        for ($j = 1; $j <= 9-$i; $j++){
            echo "&nbsp;";
        }


        for ($j = 1; $j <= $i; $j++){
            echo "*";
        }
        echo "<br>";
    }

    
?>