<?php
$host     = 'db';
$db       = 'whatsapp';
$user     = 'root';              
$password = 'rootpassword';                  
$charset  = 'utf8mb4';

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // Throws errors as exceptions
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // Returns data as associative arrays
    PDO::ATTR_EMULATE_PREPARES   => false,                  // Uses real prepared statements
];

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";


try{
    $pdo = new PDO($dsn, $user, $password, $options);
}
catch(\PDOException $e){
    die("Connection Failed : " . $e->getMessage());
}

?>