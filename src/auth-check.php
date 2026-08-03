<?php
session_start();

header('Content-Type: application/json');

$username = $_SESSION['username'];

if ($username === '') {
    http_response_code(401);
    echo json_encode(['status' => 'unauthorized']);
    exit;
}

echo json_encode(['status' => 'authorized', 'username' => $username]);
exit;
?>
