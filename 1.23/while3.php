<?php
// while문으로 마일/킬로미터 표시
// 킬로미터 = 마일 * 1.609344

    $mile = 10;
    $meter = 1;

    while($mile < 110){
        $meter = $mile * 1.609344;
        $mile += 10;
        echo "마일 : ".$mile.", 킬로미터 : ".$meter."<br>";
    }

?>