<?php
// 구구단 만들기

    // for ($i = 2; $i <= 9; $i++){
    //     echo $i."단 : ";
    //     for ($t = 1; $t <= 9; $t++){
    //         echo $i."*".$t."=".$i * $t." ";
    //     }
    //     echo "<br>";
    // }

// 표로 구구단 만들기
    $string = "";
    $string .= "<table border = '1'>";
    for ($i = 2; $i <= 9; $i++){
        $string .= "<tr>";
        for ($j = 1; $j <= 9; $j++){
            $x = $i * $j;
            $string .= "<td>".$i."x".$j."=".$x."</td>";
        }
        $string .= "</tr>";
    }
    $string .= "</table>";

    echo $string;
?>