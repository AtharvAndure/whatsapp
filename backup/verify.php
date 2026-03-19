<?php
header("Content-Type: application/json; charset=UTF-8");

if($_SERVER["REQUEST_METHOD"]!=="POST") {
    echo json_encode(["status"=>"error","message"=>"Method Should be Post"]);
    exit;
}

session_start();

$otp=isset($_POST["verify_otp"])?$_POST["verify_otp"]:"";


// Validate: must be non-empty, exactly 6 digits, and match session OTP
if ($otp === "" || strlen($otp) !== 6 || !is_numeric($otp) || $otp !== $_SESSION["otp"]) {
    echo json_encode(["status" => "error", "message" => "Invalid OTP"]);
} else {
    echo json_encode(["status" => "success", "message" => "OTP verified"]);
}


?>