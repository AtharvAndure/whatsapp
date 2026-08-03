<?php
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["status" => "error", "message" => "Method is not POST"]);
    exit;
}

session_start();

require_once __DIR__ . "/../../connection/connection.php";
require_once __DIR__ . "/../../vendor/autoload.php";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$email = isset($_POST["sender_email"]) ? trim($_POST["sender_email"]) : "";
if ($email === "" || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["status" => "error", "message" => "Enter a valid email"]);
    exit;
}

$username = getenv("GMAIL_USERNAME") ?: "atharvandure812@gmail.com";
$appPassword = "vipkdadeewrwbjfq";

$otp = (string) rand(100000, 999999);
$_SESSION["otp"] = $otp;

$mail = new PHPMailer(true);
$mail->isSMTP();
$mail->SMTPAuth = true;
$mail->SMTPDebug = 0;
$mail->CharSet = "UTF-8";
$mail->Host = getenv("SMTP_HOST") ?: "smtp.gmail.com";
$mail->Port = (int) (getenv("SMTP_PORT") ?: 587);
$mail->SMTPSecure = strtolower((string) getenv("SMTP_SECURE")) === "ssl"
    ? PHPMailer::ENCRYPTION_SMTPS
    : PHPMailer::ENCRYPTION_STARTTLS;
$mail->Username = $username;
$mail->Password = $appPassword;
$mail->setFrom($username, "Baate");
$mail->addAddress($email);
$mail->Subject = "OTP Verification";
$mail->Body = "Your OTP is $otp";

try {
    $mail->send();
    echo json_encode(["status" => "success", "message" => "OTP Sent Successfully"]);
} catch (Exception $e) {
    error_log("OTP mail error: " . $e->getMessage());
    echo json_encode([
        "status" => "error",
        "message" => "OTP not sent. SMTP error: " . $e->getMessage()
    ]);
}
?>
