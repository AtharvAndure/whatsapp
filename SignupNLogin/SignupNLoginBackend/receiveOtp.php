<?php
require_once __DIR__ . "/../../connection/connection.php";
require_once __DIR__ . '/../../vendor/autoload.php';
header("Content-Type:application/json;charset=UTF-8");

if($_SERVER["REQUEST_METHOD"]!=="POST"){
    echo json_encode(["status"=>"error","message"=>"Method is not Post"]);
    exit;
}

session_start();

$otp=isset($_POST["otp"])?$_POST["otp"]:"";
if($otp==""){
    echo json_encode(["status"=>"error","message"=>"Enter Valid OTP"]);
    exit;
}
if ($otp === "" || strlen($otp) !== 6 || !is_numeric($otp) || $otp !== $_SESSION["otp"]) {
    echo json_encode(["status" => "error", "message" => "Invalid OTP"]);
} else {
    echo json_encode(["status" => "success", "message" => "OTP verified"]);
}
?>