<?php
header("Content-Type:application /json; charset=utf");
require_once "../../connection/connection.php";

    if ($_SERVER['REQUEST_METHOD'] != 'POST'){
        echo json_encode(["status"=>"error","message"=>"Method must be Post"]);
        exit;
    }

    try{
        $query=$pdo->prepare("INSERT INTO users(username,first_name,last_name,email,pass,profile_img,gender) values(:username,:firstn,:lastn,:email,:pass,:profile_img,:gender)");
        $query->execute([
            ':username'=>$username,
            ':firstn'=> $first,
            ':lastn'=> $last,
            ':email'=> $email,
            ':pass'=> $pass,
            ':profile_img'=> $prof_img,
            ':gender'=> $gender
        ]);




    }catch(PDOException $e){
        echo json_encode(["status"=>"error","message"=>$e->getMessage()]);
    }

?>