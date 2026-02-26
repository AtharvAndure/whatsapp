<?php

header("Content-Type: application/json; charset=utf-8");
require_once "../../connection/connection.php";
// Allow GET or POST requests for retrieving current session profile
if ($_SERVER['REQUEST_METHOD'] !== 'GET' && $_SERVER['REQUEST_METHOD'] !== 'POST'){
    echo json_encode(["status"=>"error","message"=>"Method must be GET or POST"]);
    exit;
}

session_start();

if (empty($_SESSION['username'])){
    echo json_encode(["status"=>"error","message"=>"No active session"]);
    exit;
}

$username = $_SESSION['username'];

$query = "SELECT username, profile_img FROM users WHERE username = :user LIMIT 1";
$stmt = $pdo->prepare($query);
$stmt->execute([':user' => $username]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$row) {
    echo json_encode(["status" => "error", "message" => "User not found"]);
    exit;
}

echo json_encode(["status"=>"success","data"=>$row]);
?>