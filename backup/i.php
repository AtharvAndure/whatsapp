<?php
header("Content-Type:application/json;charset=utf");

if($_SERVER["REQUEST_METHOD"]!="POST"){
    echo json_encode(["status"=>"error","message"=>"Method must be Post"]);
    exit;
} 
$dbs = "mysql:host=localhost;dbname=api-example;charset=utf8mb4";
try {
    $pdo = new PDO($dbs, "root", "");

    $query = "SELECT * FROM book";
    $result = $pdo->query($query);
    $books=[];
    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        $books[] = $row;
    }
    echo json_encode(["status" => "success", "data" => $books]);
} catch (PDOException $e) {
    echo json_encode(["status"=>"error","message"=>$e->getMessage()]);
}
?>
