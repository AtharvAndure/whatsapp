<?php
    header("Content-Type: application/json; charset=utf-8");
    require_once "../../connection/connection.php";
    if($_SERVER["REQUEST_METHOD"] != "POST"){
        echo json_encode(["status"=>"error","message"=>"Method must be POST"]);
        exit;  
    }
    session_start();


    try{
        $username = isset($_POST['username']) ? trim($_POST['username']) : '';
        $password = isset($_POST['password']) ? $_POST['password'] : '';

        if ($username === '') {
            echo json_encode(["status"=>"error","message"=>"username required"]);
            exit;
        }
        if ($password === '') {
            echo json_encode(["status"=>"error","message"=>"password required"]);
            exit;
        }

        // Fetch user by username only, then verify password hash
        $query = $pdo->prepare("SELECT * FROM users WHERE username = :username LIMIT 1");
        $query->execute([
            'username' => $username
        ]);
        $row = $query->fetch();

        if (!$row) {
            // username not found
            echo json_encode(["status" => "success", "data" => false]);
            exit;
        }

        // Verify password against hashed password in DB
        if (password_verify($password, $row['pass'])) {
            $_SESSION["username"]=$username;
            echo json_encode(["status" => "success", "data" => true]);

        } else {
            echo json_encode(["status" => "success", "data" => false]);
        }

    }catch(PDOException $e){
        echo json_encode(["status"=>"error","message"=>"Data is Failed To Access.. ". $e->getMessage()]);
    }
        
    

?>