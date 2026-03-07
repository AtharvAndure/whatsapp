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
    $query = "SELECT username, profile_img, profile_disc FROM users WHERE username = :user LIMIT 1";
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

    $location = "../../asset/images/";
    $profileDisc = isset($_POST['profileDisc']) ? trim($_POST['profileDisc']) : NULL;
    $profileImg = "";

    // Handle image upload
    if (isset($_FILES['profileImage']) && $_FILES['profileImage']['error'] === UPLOAD_ERR_OK) {
        $imgType = strtolower(pathinfo($_FILES["profileImage"]["name"], PATHINFO_EXTENSION));
        $allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];
        if (!in_array($imgType, $allowedTypes)) {
            echo json_encode(["status"=>"error", "message"=>"Invalid image type."]);
            exit;
        }
        $newFileName = uniqid("img_", true) . "." . $imgType;
        $newPath = $location . $newFileName;
        if (move_uploaded_file($_FILES["profileImage"]["tmp_name"], $newPath)) {
            $profileImg = $newFileName;
        } else {
            echo json_encode(["status"=>"error", "message"=>"Failed to upload image."]);
            exit;
        }
    } elseif (isset($_POST['profileImage'])) {
        $profileImg = $_POST['profileImage']; // default image
    }

    // If no description provided, set default
    if (!$profileDisc) {
        $profileDisc = "Hey there! I am using BAATE.";
    }

    // Update database
    $query = "UPDATE users SET profile_img = :profImg, profile_disc = :profDisc WHERE username = :username";
    $stmt = $pdo->prepare($query);
    $success = $stmt->execute([
        ':profImg' => $profileImg,
        ':profDisc' => $profileDisc,
        ':username' => $username
    ]);

    if ($success) {
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