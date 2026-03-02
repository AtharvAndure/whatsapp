<?php

header("Content-Type: application/json; charset=utf-8");
error_reporting(E_ALL);
ini_set('display_errors', 1);

$host     = 'localhost';
$db       = 'test';
$user     = 'root';              
$password = '';                  
$charset  = 'utf8mb4';

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

try{
    $pdo = new PDO($dsn, $user, $password, $options);
}catch(\PDOException $e){
    echo json_encode(["error" => $e->getMessage()]);
    exit;
}

if(isset($_FILES['img'])){

    $location = "../asset/images/";

    // Create directory if it doesn't exist
    if (!is_dir($location)) {
        mkdir($location, 0755, true);
    }

    $imgType = strtolower(pathinfo($_FILES["img"]["name"], PATHINFO_EXTENSION));

    $newFileName = uniqid("img_", true) . "." . $imgType;

    $newPath = $location . $newFileName;

    if (move_uploaded_file($_FILES["img"]["tmp_name"], $newPath)) {

        try {
            // Insert image path into database
            $sql = "INSERT INTO example (img) VALUES (:imgpath)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([':imgpath' => $newPath]);

            echo json_encode([
                "status" => "success",
                "file" => $newPath,
                "message" => "Image uploaded and stored successfully"
            ]);

        } catch(PDOException $e) {
            echo json_encode([
                "status" => "error",
                "message" => "Failed to store image in database: " . $e->getMessage()
            ]);
        }

    } else {

        echo json_encode([
            "status" => "error",
            "message" => "Failed to Add File"
        ]);
    }

}else{
    echo json_encode([
        "status" => "error",
        "message" => "No file received"
    ]);
}

?>