<?php
    require_once "../../connection/connection.php";
    if($_SERVER["REQUEST_METHOD"]!="POST") {die("Db Connection Failed");}
    
    header("Content-Type:application/json; charset=utf");
    echo "success";


?>