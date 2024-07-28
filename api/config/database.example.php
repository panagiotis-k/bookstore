<?php
$host = 'localhost';
$dbname = 'bookstore';
$username = 'your_username';
$password = 'your_password';

try{
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
}catch(PDOException $e){
    http_response_code(500);
    echo json_encode(array('error' => 'Database connection failed: ' . $e->getMessage()));
    exit;
}