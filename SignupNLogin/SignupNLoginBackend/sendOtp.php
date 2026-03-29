<?php
header("Content-Type:application/json;charset=UTF-8");
if($_SERVER["REQUEST_METHOD"]!=="POST"){
    echo json_encode(["status"=>"error","message"=>"Method is not Post"]);
    exit;
}
require_once __DIR__ . "/../../connection/connection.php";
require_once __DIR__ . '/../../vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

session_start();

$email=isset($_POST["sender_email"])?$_POST["sender_email"]:"";
if($email==""){
    echo json_encode(["status"=>"error","message"=>"Enter Valid Email"]);
    exit;
}


$otp=(string)rand(100000,999999);
$_SESSION["otp"]=$otp;

$mail=new PHPMailer(true);

$mail->isSMTP();
$mail->SMTPAuth=true;

$mail->Host = "smtp.gmail.com";

$mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
$mail->Port=587;

$mail->Username = "andureatharv@gmail.com";
$mail->Password = "oobbkydsuplnzquw";

$mail->setFrom("andureatharv@gmail.com", "Baate");
$mail->addAddress($email);

$mail->Subject="OTP Verification";
$mail->Body = "Your OTP is $otp";

try{
    $mail->send();
    echo json_encode(["status"=>"success","message"=>"OTP Sent Successfully"]);
}catch(Exception $e){
    echo json_encode(["status"=>"error","message"=>"OTP Not Sent . Error: " . $mail->ErrorInfo]);
}
?>