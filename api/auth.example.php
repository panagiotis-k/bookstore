<?php
define('API_USERNAME','your_api_username');
define('API_PASSWORD','your_api_password');


if(!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW']) || 
    $_SERVER['PHP_AUTH_USER'] != API_USERNAME || $_SERVER['PHP_AUTH_PW'] != API_PASSWORD){
    header('WWW-Authenticate: Basic realm="Bookstore API"');
    http_response_code(401);
    echo json_encode(array('error' => 'Unauthorized'));
    die();
}