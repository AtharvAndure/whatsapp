<?php
header("Content-Type: application/json; charset=utf-8");
require_once "../../connection/connection.php";

if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    echo json_encode(["status" => "error", "message" => "Method must be POST"]);
    exit;
}

try{
    $username=isset($_POST['username']) ? trim($_POST['username']) : '';

    if($username === ''){
        echo json_encode(["status"=>"error","message"=>"username required"]);
        exit;
    }
    $query=$pdo->prepare("SELECT user_id FROM users WHERE username=:username");
    $query->execute([
        ':username'=>$username
    ]);
    if($query->rowCount()>0){
        echo json_encode(["status"=>"success","data"=>true]);
    }else{
        echo json_encode(["status"=>"success","data"=>false]);
    }
}catch(PDOException $e){
    echo json_encode(["status"=>"error","message"=>"Data is Failed To Access.. ". $e->getMessage()]);
}
?>