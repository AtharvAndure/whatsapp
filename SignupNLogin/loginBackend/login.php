<?php
    header("Content-Type:application/json; charset=utf");
    require_once "../../connection/connection.php";
    if($_SERVER["REQUEST_METHOD"]!="POST"){
        echo json_encode(["status"=>"error","message"=>"Method must be Post"]);
        exit;
    } 


    try{
        $username = isset($_POST['username']) ? trim($_POST['username']) : null;
        if(!$username){
            echo json_encode(["status"=>"error","message"=>"username required"]);
            exit;
        }

        $query=$pdo->prepare("SELECT * FROM users WHERE username=:username");
        $query->execute([
            'username'=>$username
        ]);
        $row=$query->fetch();
        if($row){
            // username exists
            echo json_encode(["status" => "success", "data" => true]);
        }else{
            // available
            echo json_encode(["status" => "success", "data" => false]);
        }

    }catch(PDOException $e){
        echo json_encode(["status"=>"error","message"=>"Data is Failed To Access.. ". $e->getMessage()]);
    }
        
    

?>