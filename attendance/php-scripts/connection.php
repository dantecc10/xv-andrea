<?php
    // Importar variables de entorno desde el archivo .env
    require_once (__DIR__ . '/../../vendor/autoload.php');
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
    $dotenv->load();

    $servername = $_ENV['DB_SERVER'];
    $username = $_ENV['DB_USERNAME'];
    $password = $_ENV['DB_PASSWORD'];
    $dbname = $_ENV['DB_NAME'];

    // Crear conexión
    $connection = new mysqli($servername, $username, $password, $dbname);
    // Verificar conexión
    if ($connection->connect_error) {
        die("Conexión fallida: " . $connection->connect_error);
    }
?>