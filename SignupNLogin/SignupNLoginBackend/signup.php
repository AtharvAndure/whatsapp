<?php
// 1. Fixed the header formatting
header("Content-Type: application/json; charset=utf-8");
require_once "../../connection/connection.php";

if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    echo json_encode(["status" => "error", "message" => "Method must be POST"]);
    exit;
}

try {
    // 2. Safely grab inputs (using trim to remove accidental spaces)
    $username = trim($_POST['username'] ?? '');
    $first    = trim($_POST['firstname'] ?? '');
    $last     = trim($_POST['lastname'] ?? '');
    $email    = trim($_POST['email'] ?? '');
    $pass     = $_POST['pass'] ?? '';
    $c_pass   = $_POST['c_pass'] ?? '';

    // These weren't in your form, so we provide default values
    $prof_img = $_POST['profile_img'] ?? 'default_avatar.png'; 
    $gender   = $_POST['gender'] ?? 'Not Specified';

    // 3. Check for empty fields (The Fixed Logic)
    if (!$username || !$first || !$last || !$email || !$pass || !$c_pass) {
        echo json_encode(["status" => "error", "message" => "All fields are required."]);
        exit;
    }

    // 4. Double Security Validation (Backend checks)
    if ($pass !== $c_pass) {
        echo json_encode(["status" => "error", "message" => "Passwords do not match."]);
        exit;
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["status" => "error", "message" => "Invalid email format."]);
        exit;
    }

    // 5. Check if username or email already exists
    $checkQuery = $pdo->prepare("SELECT user_id FROM users WHERE username = :username OR email = :email");
    $checkQuery->execute([
        ':username' => $username,
        ':email' => $email
    ]);
    
    if ($checkQuery->rowCount() > 0) {
        $existingUser = $checkQuery->fetch();
        echo json_encode(["status" => "error", "message" => "Username or Email already exists."]);
        exit;
    }

    // 6. Hash the password for database security!
    $hashed_password = password_hash($pass, PASSWORD_DEFAULT);

    // 7. Prepare and Execute the SQL Query
    $query = $pdo->prepare("INSERT INTO users (username, first_name, last_name, email, pass, profile_img, gender) VALUES (:username, :firstn, :lastn, :email, :pass, :profile_img, :gender)");
    
    $query->execute([
        ':username'    => $username,
        ':firstn'      => $first,
        ':lastn'       => $last,
        ':email'       => $email,
        ':pass'        => $hashed_password, // Storing the scrambled hash, NOT the raw text
        ':profile_img' => $prof_img,
        ':gender'      => $gender
    ]);

    // 8. Send a success message back to the JavaScript!
    echo json_encode(["status" => "success", "message" => "Registration successful!"]);

} catch (PDOException $e) {
    // Handle database errors
    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
}
?>