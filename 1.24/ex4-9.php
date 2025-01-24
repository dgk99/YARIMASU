<?php
    // 함수로 놀이 공원 입장료 계산하기

    function normal_ticket($day, $age){
        if ($day == "주간"){
            if ($age <= 12 or $age >= 65){
                $money = 19000;
            } else { // 대인
                $money = 26000;
            }
        } else { // 야간
            if ($age <= 12 or $age >= 65){
                $money = 16000;
            } else { // 대인
                $money = 21000;
            }
        }

        return $money;
    }

    function free_ticket($day, $age){
        if ($day == "주간"){
            if ($age <= 12 or $age >= 65){
                $money = 24000;
            } else { // 대인
                $money = 33000;
            }
        } else { // 야간
            if ($age <= 12 or $age >= 65){
                $money = 21000;
            } else { // 대인
                $money = 28000;
            }
        }

        return $money;
    }

    function twoday_ticket($age){
        if ($age <= 12 and $age >= 65){
            $money = 40000;
        } else {
            $money = 55000;
        }

        return $money;
    }

    function combi_ticket(){
        if ($age <= 12 and $age >= 65){
            $money = 40000;
        } else {
            $money = 54000;
        }

        return $money;
    }

    // ticket 1 : 일반 2 : 자유 3 : 2일권 4 : 콤비

    $ticket = 2;
    $age = 20;
    $time = "야야간";

    if ($ticket == 1){
        $price = normal_ticket($time, $age);
    } else if ($ticket == 2){
        $price = free_ticket($time, $age);
    } else if ($ticket == 3){
        $price = twoday_ticket($age);
    } else {
        $price = combi_ticket($age);
    }

    echo $price;

?>