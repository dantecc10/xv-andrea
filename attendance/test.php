<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Lector QR</title>
    <script src="https://unpkg.com/html5-qrcode"></script>
</head>

<body>

    <h2>Escanear código QR</h2>
    <div id="reader" style="width:300px;"></div>
    <p><strong>Resultado:</strong> <span id="result"></span></p>

    <script src="assets/js/qr-camera.js"></script>

    <button onclick="startScanner()">Iniciar Escáner</button>
    <a id="qr-link" href="">Enlace de invitado</a>
</body>

</html>