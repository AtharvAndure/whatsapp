<?php
header("Content-Type: application/json");
require_once __DIR__ . "/../connection/connection.php";
require_once __DIR__ . "/../vendor/autoload.php";

// Check Wether the method is POST or NOT!
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["status" => "error", "message" => "Method is not POST"]);
    exit;
}

$email=isset($_POST["email"])?$_POST["email"]:"";
if($email==""){
    echo json_encode(["status"=>"error","message"=>"Enter Valid Email"]);
    exit;
}
    echo json_encode(["status"=>"success","message"=>"Valid Email"]);


?>