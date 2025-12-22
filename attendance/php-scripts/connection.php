<?php
// Importar variables de entorno desde el archivo .env
require_once(__DIR__ . '/../../vendor/autoload.php');
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->load();

if($_ENV['ENVIRONMENT'] === 'DEVELOPMENT'){
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}

$servername = "127.0.0.1"; // $_ENV['DB_HOST'];
$username = $_ENV['DB_USER'];
$password = $_ENV['DB_PASSWORD'];
$dbname = $_ENV['DB_NAME'];

// Crear conexión
$connection = new mysqli($servername, $username, $password, $dbname);
// Verificar conexión
if ($connection->connect_error) {
    die("Conexión fallida: " . $connection->connect_error);
}

print_r($_ENV);