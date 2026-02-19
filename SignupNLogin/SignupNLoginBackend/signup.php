<?php

    if ($_SERVER['REQUEST_METHOD'] !== 'POST')
        die();

    header("Content-Type:application /json; charset=utf");
    require_once "../../connection/connection.php";

    $query=$pdo->query("INSERT INTO users()")
?>