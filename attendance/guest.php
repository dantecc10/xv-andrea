<?php
include("php-scripts/connection.php"); // Se importa la conexión a la base de datos

if (isset($_GET['qr_code'])) {
    $qr_code = $_GET['qr_code'];

    // Preparar y ejecutar la consulta para buscar el código QR y traer datos del invitado
    $stmt = $connection->prepare("
        SELECT 
            qr.id_qr_code,
            qr.link_qr_code,
            qr.adults_qr_code,
            qr.kids_qr_code,
            g.id_guest,
            g.family_guest,
            g.name_guest,
            g.last_names_guest,
            g.assigned_to_table,
            g.phone_number_guest,
            g.status_guest
        FROM qr_codes qr
        JOIN guests g ON qr.assigned_to_guest = g.id_guest
        WHERE qr.id_qr_code = ?
    ");
    $stmt->bind_param("s", $qr_code);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $data = $result->fetch_assoc();
        $adultPasses = intval($data['adults_qr_code'] ?? 0);
        $kidPasses = intval($data['kids_qr_code'] ?? 0);

        // Verificar si se está usando AJAX
        if (isset($_GET['ajax'])) {
            // Devolver respuesta en formato JSON
            header('Content-Type: application/json');
            echo json_encode([
                'success' => true,
                'data' => [
                    'id_qr_code' => $data['id_qr_code'],
                    'link_qr_code' => $data['link_qr_code'],
                    'name_guest' => $data['name_guest'],
                    'last_names_guest' => $data['last_names_guest'],
                    'family_guest' => $data['family_guest'],
                    'phone_number_guest' => $data['phone_number_guest'] ?? '',
                    'status_guest' => $data['status_guest'] ?? '',
                    'adults_qr_code' => $adultPasses,
                    'kids_qr_code' => $kidPasses,
                    'total_passes' => $adultPasses + $kidPasses,
                    'assigned_to_table' => intval($data['assigned_to_table'])
                ]
            ]);
        } else {
            // Redirigir a index.php con parámetro $_GET['redirect'] con el link del pase
            $redirectLink = $data['link_qr_code'];
            header("Location: index.php?redirect=" . urlencode($redirectLink));
            exit();
            
            // Respuesta HTML tradicional
            /*
            echo "Invitado encontrado: " . htmlspecialchars($data['name_guest']) . " " . htmlspecialchars($data['last_names_guest']);
            echo "<br>Familia: " . htmlspecialchars($data['family_guest']);
            echo "<br>Teléfono: " . htmlspecialchars($data['phone_number_guest'] ?? '');
            echo "<br>Estado: " . htmlspecialchars($data['status_guest'] ?? '');
            echo "<br>Adultos permitidos: " . $adultPasses;
            echo "<br>Niños permitidos: " . $kidPasses;
            echo "<br>Pases totales: " . ($adultPasses + $kidPasses);
            echo "<br>Mesa asignada: " . intval($data['assigned_to_table']);
            */
        }
        // Aquí puedes agregar más lógica, como registrar la asistencia
    } else {
        // Verificar si se está usando AJAX para el error
        if (isset($_GET['ajax'])) {
            header('Content-Type: application/json');
            echo json_encode([
                'success' => false,
                'message' => 'Invitado no encontrado.'
            ]);
        } else {
            echo "Invitado no encontrado.";
        }
    }

    $stmt->close();
} else {
    // Verificar si se está usando AJAX para el error
    if (isset($_GET['ajax'])) {
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'message' => 'No se proporcionó ningún código QR.'
        ]);
    } else {
        echo "No se proporcionó ningún código QR.";
    }
}
