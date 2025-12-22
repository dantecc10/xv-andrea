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

    <script>
        const result = document.getElementById("result");

        const qrCodeScanner = new Html5Qrcode("reader");

        qrCodeScanner.start({
                facingMode: "environment"
            }, // cámara trasera en móviles
            {
                fps: 10,
                qrbox: 250
            },
            (decodedText) => {
                result.textContent = decodedText;

                // Si es un enlace, puedes redirigir
                if (decodedText.startsWith("http")) {
                    window.location.href = decodedText;
                }

                qrCodeScanner.stop();
            },
            (errorMessage) => {
                // errores silenciosos de lectura
            }
        );
    </script>

</body>

</html>