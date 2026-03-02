<?php
header("Content-Type: application/json; charset=utf-8");
require_once "../../connection/connection.php";

session_start();

// Fetching User through Session
if (empty($_SESSION['username'])){
    echo json_encode(["status"=>"error","message"=>"No active session"]);
    exit;
}

$username = $_SESSION['username'];

// ==========================================
// 1. HANDLE GET REQUEST (FETCHING DATA)
// ==========================================
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $query = "SELECT username, profile_img FROM users WHERE username = :user LIMIT 1";
    $stmt = $pdo->prepare($query);
    $stmt->execute([':user' => $username]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row) {
        echo json_encode(["status" => "error", "message" => "User not found"]);
        exit;
    }
    
    // Send success for GET and EXIT so the script stops here
    echo json_encode(["status"=>"success", "action"=>"fetch", "data"=>$row]);
    exit; 
}

// ==========================================
// 2. HANDLE POST REQUEST (UPDATING DATA)
// ==========================================
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Read the raw JSON from the JavaScript fetch request
    $jsonInput = file_get_contents('php://input');
    $data = json_decode($jsonInput, true);

    $profileImg = isset($data['profileImage']) ? $data['profileImage'] : NULL;
    $profileDisc = isset($data['profileDisc']) ? $data['profileDisc'] : NULL;

    // Optional: Check if data is completely missing
    if (!$profileImg && !$profileDisc) {
        echo json_encode(["status"=>"error", "message"=>"No data provided to update."]);
        exit;
    }

    $query = "UPDATE users SET profile_img=:profImg, profile_disc=:profDisc WHERE username=:username";
    $stmt = $pdo->prepare($query);
    
    // Execute with all 3 bound parameters
    $success = $stmt->execute([
        ':profImg'   => $profileImg,
        ':profDisc'  => $profileDisc,
        ':username'  => $username // Added the missing username binding
    ]);

    if ($success) {
        // Send success for POST and EXIT
        echo json_encode(["status"=>"success", "action"=>"update", "message"=>"Profile updated!"]);
    } else {
        echo json_encode(["status"=>"error", "message"=>"Database update failed."]);
    }
    exit;
}

// If it's neither GET nor POST
echo json_encode(["status"=>"error","message"=>"Method must be GET or POST"]);
exit;
?>