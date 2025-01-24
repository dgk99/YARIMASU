<?php
    // strlen()과 str_replace() 사용 예

    $string = "php is fun.";

    $length = strlen($string);
    echo $length."<br>";

    $string2 = str_replace("php", "PHP", $string);
    echo $string2."<br>";

?>