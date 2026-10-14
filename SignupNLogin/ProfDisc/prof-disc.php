<?php
header("Content-Type: application/json; charset=utf-8");
require_once "../../connection/connection.php";

session_start();

// FIXED: Validate session existence before assignment to prevent PHP warnings from breaking JSON parsing
if (!isset($_SESSION['username']) || empty($_SESSION['username'])) {
    echo json_encode(["status" => "error", "message" => "No active session"]);
    exit;
}

$username = $_SESSION['username'];

// ==========================================
// 1. HANDLE GET REQUEST (FETCHING DATA)
// ==========================================
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $query = "SELECT username, profile_img, profile_desc FROM users WHERE username = :user LIMIT 1";
    $stmt = $pdo->prepare($query);
    $stmt->execute([':user' => $username]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row) {
        echo json_encode(["status" => "error", "message" => "User not found"]);
        exit;
    }
    
    echo json_encode(["status" => "success", "action" => "fetch", "data" => $row]);
    exit; 
}

// ==========================================
// 2. HANDLE POST REQUEST (UPDATING DATA)
// ==========================================
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $location = "../../asset/images/";
    $profileDisc = isset($_POST['profileDisc']) ? trim($_POST['profileDisc']) : "";
    $profileImg = null;
    $hasNewImage = false;
    $oldImageName = null;

    // Handle image upload only if a file was provided
    if (isset($_FILES['profileImage']) && $_FILES['profileImage']['error'] === UPLOAD_ERR_OK) {
        $imgType = strtolower(pathinfo($_FILES["profileImage"]["name"], PATHINFO_EXTENSION));
        $allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];
        
        if (!in_array($imgType, $allowedTypes)) {
            echo json_encode(["status" => "error", "message" => "Invalid image type."]);
            exit;
        }
        
        $newFileName = uniqid("img_", true) . "." . $imgType;
        $newPath = $location . $newFileName;
        
        if (move_uploaded_file($_FILES["profileImage"]["tmp_name"], $newPath)) {
            $profileImg = $newFileName;
            $hasNewImage = true;

            // NEW FEATURE: Fetch the existing profile image from the DB before overwriting
            $stmtOld = $pdo->prepare("SELECT profile_img FROM users WHERE username = :user LIMIT 1");
            $stmtOld->execute([':user' => $username]);
            $oldRow = $stmtOld->fetch(PDO::FETCH_ASSOC);
            if ($oldRow && !empty($oldRow['profile_img'])) {
                $oldImageName = $oldRow['profile_img'];
            }

        } else {
            echo json_encode(["status" => "error", "message" => "Failed to upload image."]);
            exit;
        }
    }

    // If no description provided, set default
    if ($profileDisc == "") {
        $profileDisc = "Hey there! I am using BAATE.";
    }

    // Update database
    if ($hasNewImage) {
        $query = "UPDATE users SET profile_img = :profImg, profile_desc = :profDisc WHERE username = :username";
        $bindings = [
            ':profImg' => $profileImg,
            ':profDisc' => $profileDisc,
            ':username' => $username
        ];
    } else {
        $query = "UPDATE users SET profile_desc = :profDisc WHERE username = :username";
        $bindings = [
            ':profDisc' => $profileDisc,
            ':username' => $username
        ];
    }
    
    $stmt = $pdo->prepare($query);
    $success = $stmt->execute($bindings);

    if ($success) {
        // NEW FEATURE: Delete the old image file from the directory
        // CHANGE "default.png" if your default image is named something else
        $defaultImageName = "default.png"; 

        if ($hasNewImage && !empty($oldImageName) && $oldImageName !== $defaultImageName) {
            $oldImagePath = $location . $oldImageName;
            
            // Ensure the file exists before attempting to delete it
            if (file_exists($oldImagePath)) {
                unlink($oldImagePath);
            }
        }

        echo json_encode(["status" => "success", "action" => "update", "message" => "Profile updated!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Database update failed."]);
    }
    exit;
}

echo json_encode(["status" => "error", "message" => "Method must be GET or POST"]);
exit;
?>