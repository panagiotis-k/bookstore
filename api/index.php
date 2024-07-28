<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { // Handle preflight requests
    die();
}

include './auth.php';

include './config/database.php'; // DB Connection
include './controllers/BookController.php';

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = trim($path, '/');

$parts = explode('/', $path);
$id = isset($parts[3]) ? intval($parts[3]) : null;

$bookController = new BookController($pdo);

switch($method){
    case 'GET':
        $bookController->getBooks($id);
        break;

    case 'POST':
        $bookController->createBook();
        break;

    case 'PUT':
        $bookController->updateBook($id);
        break;

    case 'DELETE':
        $bookController->deleteBook($id);
        break;

    default:
        http_response_code(405);
        echo json_encode(array('error' => 'Method not allowed'));
        break;
}
