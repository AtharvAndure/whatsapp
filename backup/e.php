<?php

use PHPMailer\PHPMailer\PHPMailer;

header("Content-Type: application/json");
require_once __DIR__ . "/../connection/connection.php";
require_once __DIR__ . "/../vendor/autoload.php";

// Check Wether the method is POST or not!
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

// Generate Random Number
    $otp=random_int(100000,999999);


// Step 1 : using PHP Mailer to send the Email
    $mail=new PHPMailer(true);

// Step 2 : Tell the server we are using SMTP server
    $mail->isSMTP();
    $mail->SMTPAuth=true;
    
// Step 3 : Define Host 
    $mail->Host = "smtp.gmail.com";

// Step 4 : PHP Mailer Encryption Type
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port=587;

// Step 5 : USERNAME and PASSWORD
    $mail->Username = "andureatharv@gmail.com";
    $mail->Password = "pokdxwtvgsshczbe";

// Step 6 : Define Sender and Reciver Address
    $mail->setFrom("andureatharv@gmail.com","Admin");
    $mail->addAddress($email);

// Step 7 : Body and Message
    $mail->Subject="OTP Verification";
    $mail->Body = "Your OTP is 4658";

// Step 8 : Send the mail
    $mail->send();



?>