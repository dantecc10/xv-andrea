<?php
include("php-scripts/connection.php"); // Se importa la conexión a la base de datos

if (isset($_GET['qr_code'])) {
    $qr_code = $_GET['qr_code'];

    // Preparar y ejecutar la consulta para buscar el código QR y traer datos del invitado
    $stmt = $connection->prepare("
        SELECT 
            qr.id_qr_code,
            qr.link_qr_code,
            qr.passes_qr_code,
            g.id_guest,
            g.family_guest,
            g.name_guest,
            g.last_names_guest,
            g.assigned_to_table
        FROM qr_codes qr
        JOIN guests g ON qr.assigned_to_guest = g.id_guest
        WHERE qr.id_qr_code = ?
    ");
    $stmt->bind_param("s", $qr_code);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $data = $result->fetch_assoc();
        echo "Invitado encontrado: " . htmlspecialchars($data['name_guest']) . " " . htmlspecialchars($data['last_names_guest']);
        echo "<br>Familia: " . htmlspecialchars($data['family_guest']);
        echo "<br>Pases disponibles: " . intval($data['passes_qr_code']);
        echo "<br>Mesa asignada: " . intval($data['assigned_to_table']);
        // Aquí puedes agregar más lógica, como registrar la asistencia
    } else {
        echo "Invitado no encontrado.";
    }

    $stmt->close();
} else {
    echo "No se proporcionó ningún código QR.";
}
