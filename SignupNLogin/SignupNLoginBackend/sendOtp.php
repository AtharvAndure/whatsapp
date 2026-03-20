<?php
header("Content-Type:application/json;charset=UTF-8");
if($_SERVER["REQUEST_METHOD"]!=="POST"){
    echo json_encode(["status"=>"error","message"=>"Method is not Post"]);
    exit;
}


session_start();
?>